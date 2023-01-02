import React, { Component, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h copy.js';
import io from 'socket.io-client';

const socket = io();

function BarChart(props) {
  const { chartID } = props;

  const [title, setTitle] = useState('Hourly Distribution')
  const [barData, setBarData] = useState({
    // labels will be for date -> most likely going to do a cache arr as date.time
    labels: [0],
    datasets: [
      {
        label: chartID,
        data: [0],
        backgroundColor: ['#000000']
      },
      {
        label: chartID,
        data: [0],
        type: 'line',
        backgroundColor: ['#000000']
      }
    ],
  });

  socket.on('connect', () => {
    console.log('socket connected')
  });

  socket.on(chartID, (data) => {
    if (data[0].metric.topic !== title) setTitle(data[0].metric.topic)

    const [binArray, countArr, colorArr, linRegressArr] = convertKafkatoChart(data)

    const newObj = {
      labels: binArray,
      datasets: [{
        label: chartID, // label not showing up here
        data: countArr,
        // parsing: false,
        backgroundColor: colorArr,
        order: 1,
      },
      {
        label: 'Average', // label not showing up here //fuck you Walter you fucking name it label'S'!!!!!
        data: linRegressArr,
        backgroundColor: 'rgb(52,153,204)',
        borderColor: 'rgb(52,153,204)',
        type: 'line',
        pointRadius: 0
      }]
    };
    setBarData(newObj);
  });

  // socket.on('connect_error', (err) => {
  //   console.log(`connect_error due to ${err.message}`);
  // });

  function convertKafkatoChart(data) {
    // if kafkadata is null
    if (!data) return [[], []];

    // we need to convert our unix timestamps to regular time stamps
    // need to create an array to house our metrics, correlated to specific time stamp
    const results = data; // results here is an array
    const topicData = {};
    topicData[data[0].metric.topic] = data[0].values
    const binArray = [];
    const countArr = [];
    const colorArr = [];
    const linRegressArr = [];
    topicData[data[0].metric.topic].forEach(element => {
      binArray.push((Number(element[0])/1000000).toExponential(2))
      countArr.push(Number(element[1]))
      // colorArr.push(getRandomColor())
      colorArr.push('rgb(52,153,204,0.5)')
    })
    for (let i = 0; i < countArr.length; i++) {
      linRegressArr.push(countArr.reduce((a, b) => a + b, 0) / countArr.length)
    }

    return [binArray, countArr, colorArr, linRegressArr]
  }
  
  const options = { 
    animation: false,
    maintainAspectRatio: false, 
    responsive: true,
    scales: {
      x: {
        ticks: {
            font: {
                size: 10,
            }
        }
      },
      y: {
        ticks: {
            font: {
                size: 10,
            }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: true,
        text: `${title}, Hourly Distribution (MB)`,
      },
    }
  }

  return (
    <div id='barGraph'>
      <Bar id='barGraph' 
        options={options}
        data={barData} 
      />
    </div>
  )
}


export default BarChart;