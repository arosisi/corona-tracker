import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area
} from "recharts";

class Graph extends React.Component {
  render() {
    const { width, height, raw, name } = this.props;
    const data = raw[name];
    return (
      <div style={{ marginTop: 10 }}>
        <h3>{!name ? "Country" : name}</h3>
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
