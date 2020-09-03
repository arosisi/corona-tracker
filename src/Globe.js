import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Globe from "react-globe.gl";
import * as d3 from "d3";

const AGGREGATED = "aggregated";
const TODAY = "today";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.globe = React.createRef();
    this.colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    this.state = {
      loading: true,
      altitude: 0.1,
      transitionDuration: 1000,
      hovered: "",
      dataType: AGGREGATED
    };
  }

  componentDidMount() {
    this.globe.current.pointOfView({ altitude: 4 }, 5000);

    this.color();
    this.setState({ loading: false });

    setTimeout(this.elevate(), 3000);
  }

  color = () => {
    const aggregated = this.state.dataType === AGGREGATED;
    const max = this.props.data.reduce(
      (max, item) =>
        Math.max(max, aggregated ? item.confirmed : item.justConfirmed),
      0
    );
    this.colorScale.domain([0, max]);
  };

  elevate = () =>
    this.setState({
      altitude:
        this.state.dataType === AGGREGATED
          ? ({ confirmed }) => Math.max(0.1, (confirmed / 500) * 7e-5)
          : ({ justConfirmed }) => Math.max(0.1, (justConfirmed / 10) * 7e-5),
      transitionDuration: 4000
    });

  render() {
    const { width, height, data, drawGraph } = this.props;
    const {
      loading,
      altitude,
      transitionDuration,
      hovered,
      dataType
    } = this.state;
    const aggregated = dataType === AGGREGATED;
    return (
      <div>
        <Dropdown style={{ position: "fixed", top: 5, left: 20, zIndex: 1 }}>
          <Dropdown.Toggle variant='success'>Data type</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              active={aggregated}
              onClick={() =>
                this.setState({ dataType: AGGREGATED }, () => {
                  this.color();
                  this.elevate();
                })
              }
            >
              Aggregated
            </Dropdown.Item>
            <Dropdown.Item
              active={!aggregated}
              onClick={() =>
                this.setState({ dataType: TODAY }, () => {
                  this.color();
                  this.elevate();
                })
              }
            >
              Today
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Globe
          ref={this.globe}
          backgroundImageUrl='//unpkg.com/three-globe/example/img/night-sky.png'
          globeImageUrl='//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
          bumpImageUrl='//unpkg.com/three-globe/example/img/earth-topology.png'
          showGraticules
          width={width}
          height={height}
          polygonsData={data}
          polygonAltitude={altitude}
          polygonCapColor={
            loading
              ? "#ffffaa"
              : p =>
                  p === hovered
                    ? "steelblue"
                    : this.colorScale(
                        aggregated ? p.confirmed : p.justConfirmed
                      )
          }
          polygonSideColor={() => "rgba(0, 10000, 0, 0.15)"}
          polygonStrokeColor={() => "#111"}
          polygonLabel={({
            name,
            code,
            confirmed,
            deaths,
            recovered,
            justConfirmed,
            justDeaths,
            justRecovered
          }) => `
            <b>${name} (${code})</b>
            ${`
                <br />
                Confirmed: <i>${
                  aggregated ? confirmed : justConfirmed
                }</i><br />
                ${
                  recovered
                    ? `Recovered: <i>${
                        aggregated ? recovered : justRecovered
                      }</i><br />`
                    : ""
                }
                Deaths: <i>${aggregated ? deaths : justDeaths}</i>
              `}
          `}
          onPolygonClick={({ name }) => drawGraph(name)}
          onPolygonHover={p => this.setState({ hovered: p })}
          polygonsTransitionDuration={transitionDuration}
        />
      </div>
    );
  }
}
