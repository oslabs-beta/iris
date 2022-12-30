import React, { Component, useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import io from 'socket.io-client';
import mock1h from '../../dummyData/mockData_1h';
const socket = io();

function PieChart(props) {
  const { chartID } = props;
  const [pieData, setPieData] = useState({
    // labels will be for date -> most likely going to do a cache arr as date.time
    labels: [],
    datasets: [
      {
        label: chartID,
        data: [],
        backgroundColor: []
      },
    ],
  });

  // socket.on('connect', () => {
  //   console.log('socket connected')
  // });

  socket.on(chartID, async (res) => { // data => array of 3  [ {metric, value} ,  {metric, value} ,  {metric, value} ]
    const data = JSON.parse(res)
    const [binArray, countArr, colorArr] = convertKafkatoChart(data)

    const newObj = {
      labels: binArray,
      datasets: [{
        label: chartID,
        data: countArr,
        backgroundColor: colorArr,
      }]
    };
    setPieData(newObj);
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  /////////////////////////
  // tester code until we figure out how data comes in
  function getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function convertKafkatoChart(data) {
    // if kafkadata is null
    if (!data) return [[], []];

    // we need to convert our unix timestamps to regular time stamps
    // need to create an array to house our metrics, correlated to specific time stamp
    // console.log('data:', data)
    const results = data; // results here is an array
    const topicData = {};
    topicData[data[0].metric.topic] = data[0].values
    const binArray = [];
    const countArr = [];
    const colorArr = ['rgb(52,153,204,0.7)', '#eb8686', '#86eb9d'];

    for (let i = 0; i < data.length; i++) {
      // parsing metric topic
      binArray.push(data[i].metric.topic)

      // parsing values
      let values = data[i].values[0];
      countArr.push(Number(values[1]))
      // colorArr.push(getRandomColor())
    }

    return [binArray, countArr, colorArr]
  }

  return (
    <div id='pieGraph'>
      <Pie id='pieGraph' 
        options={
          { 
            animation: false,
            maintainAspectRatio: false, 
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Hourly Distribution',
              },
            } 
          }
        } 
        data={pieData} 
      />
    </div>
  )
}

export default PieChart;