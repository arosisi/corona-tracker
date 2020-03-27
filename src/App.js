import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Globe from "./Globe";
import Graph from "./Graph";

import { data } from "./data.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      loading: true,
      raw: [],
      data: [],
      name: ""
    };
  }

  componentDidMount() {
    window.addEventListener("resize", ({ target }) =>
      this.setState({
        windowWidth: target.innerWidth,
        windowHeight: target.innerHeight
      })
    );

    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            loading: false,
            raw: result,
            data: data.map(item => {
              const { name } = item;
              const found = result[name] && result[name].slice(-1)[0];
              return {
                ...item,
                confirmed: found ? found.confirmed : 0,
                deaths: found ? found.deaths : 0,
                recovered: found ? found.recovered : 0
              };
            })
          });
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
    const { windowWidth, windowHeight, loading, raw, data, name } = this.state;
    return (
      <div>
        <Row style={{ margin: 0 }}>
          <Col xs={12} lg={6}>
            {loading ? null : (
              <Globe
                width={
                  windowWidth >= 992 ? windowWidth / 2 - 30 : windowWidth - 30
                }
                height={
                  windowWidth >= 992 ? windowHeight - 5 : windowHeight / 2
                }
                data={data}
                drawGraph={name => this.setState({ name })}
              />
            )}
          </Col>
          <Col xs={12} lg={6}>
            {loading ? null : <Graph raw={raw} name={name} />}
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
