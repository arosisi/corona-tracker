import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area
} from "recharts";

const AGGREGATED = "aggregated";
const DAILY = "daily";

class Graph extends React.Component {
  state = { dataType: AGGREGATED };

  render() {
    const { width, height, raw, name } = this.props;
    const { dataType } = this.state;
    const aggregated = dataType === AGGREGATED;
    const data = aggregated
      ? raw[name]
      : raw[name] &&
        raw[name].map((item, index) => {
          if (!index) return item;
          let confirmed = item.confirmed - raw[name][index - 1].confirmed;
          let deaths = item.deaths - raw[name][index - 1].deaths;
          let recovered = item.recovered - raw[name][index - 1].recovered;
          confirmed = confirmed > 0 ? confirmed : 0;
          deaths = deaths > 0 ? deaths : 0;
          recovered = recovered > 0 ? recovered : 0;
          return {
            ...item,
            confirmed,
            deaths,
            recovered
          };
        });
    return (
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex" }}>
          <h3>{!name ? "Click a country on the globe" : name}</h3>
          <span style={{ flexGrow: 1 }} />
          <Dropdown style={{ marginRight: 39 }}>
            <Dropdown.Toggle variant='success'>Data type</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={aggregated}
                onClick={() => this.setState({ dataType: AGGREGATED })}
              >
                Aggregated
              </Dropdown.Item>
              <Dropdown.Item
                active={!aggregated}
                onClick={() => this.setState({ dataType: DAILY })}
              >
                Daily
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorConfirmed' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorRecovered' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorDeaths' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ffc658' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#ffc658' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey='date' />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Area
            type='monotone'
            dataKey='confirmed'
            name='Confirmed'
            stroke='#8884d8'
            fillOpacity={1}
            fill='url(#colorConfirmed)'
          />
          <Area
            type='monotone'
            dataKey='recovered'
            name='Recovered'
            stroke='#82ca9d'
            fillOpacity={1}
            fill='url(#colorRecovered)'
          />
          <Area
            type='monotone'
            dataKey='deaths'
            name='Deaths'
            stroke='#ffc658'
            fillOpacity={1}
            fill='url(#colorDeaths)'
          />
        </AreaChart>
      </div>
    );
  }
}

export default Graph;
