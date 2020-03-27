import React from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.globe = React.createRef();
    this.colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    this.state = {
      loading: true,
      altitude: 0.1,
      transitionDuration: 1000,
      hovered: ""
    };
  }

  componentDidMount() {
    this.globe.current.pointOfView({ altitude: 4 }, 5000);

    const maxConfirmed = this.props.data.reduce(
      (max, item) => Math.max(max, item.confirmed),
      0
    );
    this.colorScale.domain([0, maxConfirmed]);
    this.setState({ loading: false });

    setTimeout(() => {
      this.setState({
        altitude: ({ confirmed }) => Math.max(0.1, (confirmed / 10) * 7e-5),
        transitionDuration: 4000
      });
    }, 3000);
  }

  render() {
    const { width, height, data, drawGraph } = this.props;
    const { loading, altitude, transitionDuration, hovered } = this.state;
    return (
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
            : p => (p === hovered ? "steelblue" : this.colorScale(p.confirmed))
        }
        polygonSideColor={() => "rgba(0, 10000, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ name, code, confirmed, deaths, recovered }) => `
          <b>${name} (${code})</b>
          ${`
              <br />
              Confirmed: <i>${confirmed}</i><br />
              ${recovered ? `Recovered: <i>${recovered}</i><br />` : ""}
              Deaths: <i>${deaths}</i>
            `}
        `}
        onPolygonClick={({ name }) => drawGraph(name)}
        onPolygonHover={p => this.setState({ hovered: p })}
        polygonsTransitionDuration={transitionDuration}
      />
    );
  }
}
