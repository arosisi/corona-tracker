import React from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";

import { data } from "./data.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.globe = React.createRef();
    this.colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    this.state = {
      loading: true,
      raw: [],
      data: [],
      altitude: 0.1,
      transitionDuration: 1000,
      hovered: ""
    };
  }

  componentDidMount() {
    this.globe.current.pointOfView({ altitude: 3 }, 5000);

    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(res => res.json())
      .then(
        result => {
          let maxConfirmed = 0;

          this.setState({
            loading: false,
            raw: result,
            data: data.map(item => {
              const { name } = item;
              const found = result[name] && result[name].slice(-1)[0];

              if (found) {
                maxConfirmed = Math.max(maxConfirmed, found.confirmed);
              }

              return {
                ...item,
                confirmed: found ? found.confirmed : 0,
                deaths: found ? found.deaths : 0,
                recovered: found ? found.recovered : 0
              };
            })
          });

          this.colorScale.domain([0, maxConfirmed]);

          setTimeout(() => {
            this.setState({
              altitude: ({ confirmed }) =>
                Math.max(0.1, (confirmed / 10) * 7e-5),
              transitionDuration: 4000
            });
          }, 3000);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({ loading: true }, console.log);
        }
      );
  }

  render() {
    const {
      loading,
      raw,
      data,
      altitude,
      transitionDuration,
      hovered
    } = this.state;
    return (
      <div style={{ display: "flex" }}>
        <Globe
          ref={this.globe}
          globeImageUrl='//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
          bumpImageUrl='//unpkg.com/three-globe/example/img/earth-topology.png'
          backgroundImageUrl='//unpkg.com/three-globe/example/img/night-sky.png'
          // width={window.innerWidth - 50}
          // height={window.innerHeight - 20}
          polygonsData={data}
          polygonAltitude={altitude}
          polygonCapColor={p =>
            p === hovered ? "steelblue" : this.colorScale(p.confirmed)
          }
          polygonSideColor={() => "rgba(0, 10000, 0, 0.15)"}
          polygonStrokeColor={() => "#111"}
          polygonLabel={({ name, code, confirmed, deaths, recovered }) => `
            <b>${name} (${code})</b>
            ${
              loading
                ? ""
                : `
                  <br />
                  Confirmed: <i>${confirmed}</i><br />
                  Deaths: <i>${deaths}</i>
                  ${
                    recovered
                      ? `
                      <br />
                      Recovered: <i>${recovered}</i>
                    `
                      : ""
                  }
                `
            }
          `}
          onPolygonClick={({ name }) => console.log(JSON.stringify(raw[name]))}
          onPolygonHover={p => this.setState({ hovered: p })}
          polygonsTransitionDuration={transitionDuration}
        />
      </div>
    );
  }
}

export default App;
