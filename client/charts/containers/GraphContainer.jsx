import React, { Component } from 'react';
import LineChart from '../components/LineChart.jsx';

function GraphContainer(props) {
  // return our render
  // need 2 drop downs -> 1) metrics, 2) timeframe
  return (
    <div id='graphContainer'>
      {/* metrics */}
      <div class="dropdown">
        <button class="dropbtn">Metrics</button>
        <div class="dropdown-content">
          <a href="#">JVM</a>
          <a href="#">CPU</a>
          <a href="#">Bytes I/O</a>
        </div>
      </div>

      {/* timeframe */}
      <div class="dropdown">
        <button class="dropbtn">Timeframe</button>
        <div class="dropdown-content">
          <a href="#">1Min</a>
          <a href="#">5Min</a>
          <a href="#">15Min</a>
        </div>
      </div>

      <LineChart />
    </div>
  )
}

export default GraphContainer;