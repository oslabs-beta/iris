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

  socket.on(chartID, (data) => { // data => array of 3  [ {metric, value} ,  {metric, value} ,  {metric, value} ]
    const [binArray, countArr, colorArr] = convertKafkatoChart(data)

    const newObj = {
      labels: binArray,
      datasets: [{
        label: chartID,
        data: countArr,
        parsing: false,
        backgroundColor: colorArr,
      }]
    };
    setPieData(newObj);
  });

  function convertKafkatoChart(data) {
    // if kafkadata is null
    if (!data) return [[], []];

    // we need to convert our unix timestamps to regular time stamps
    // need to create an array to house our metrics, correlated to specific time stamp
    const topicData = {};
    topicData[data[0].metric.topic] = data[0].values
    const binArray = [];
    const countArr = [];
    const colorArr = ['rgb(52,153,204,0.7)', '#eb8686', '#86eb9d'];

    for (let i = 0; i < data.length; i++) {
      const splitName = data[i].metric.topic.split('_')
      const topicName = splitName[splitName.length-1]
      // parsing metric topic
      binArray.push(topicName)

      // parsing values
      let values = data[i].values[0];
      countArr.push(Number(values[1]))
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
                position: 'right',
              },
              title: {
                position: 'top',
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