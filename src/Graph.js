import React from "react";

class Graph extends React.Component {
  render() {
    const { raw, name } = this.props;
    return <div>{name}</div>;
  }
}

export default Graph;
