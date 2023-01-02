import React, { Component, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h';
import mock6h from '../../dummyData/mockData_6h';


// no need for axios request, will be passed as props later
function LineChart(props) {
  // deconstruct chartData
  const { chartData } = props;

  const [chartMetric, updateLine] = useState({
    // labels will be for date -> most likely going to do a cache arr as date.time
    labels: ['filler'],
    datasets: [
      {
        label: "filler",
        data: [0],
        borderColor: "gray"
      }
    ],
  });

  const [options, setOptions] = useState({ 
    animation: false,
    maintainAspectRatio: true, 
    responsive: true,
    spanGaps: true,
    normalized: true,
    layout: {
      padding: {
        right: 30,
        left: 30,
        bottom: 30
      }
    },
    elements: {
      point:{
          radius: 0
      }
    },
    scales: {
      x: {
        ticks: {
          sampleSize: 5
        }
      },
      y: {
        ticks: {
          sampleSize: 5
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font : {
            family: 'Trebuchet MS',
          },
        },
        position: 'top',
      },
      title: {
        display: true,
        text: chartData[0].metric.__name__,
      },
    } 
  })

  // function to generate random colors for our chartjs lines
  function getRandomColor() {
    let color = 'rgb(52,153,'
    color += String(Math.floor(Math.random()*100)+150) + ','
    color += String(Math.random()*0.60+0.30) + ')'

    return color;
  }

  function convertKafkatoChart(kafkaData) {
    // if kafkadata is null
    if (!kafkaData) return [[], []];

    // we need to convert our unix timestamps to regular time stamps
    // need to create an array to house our metrics, correlated to specific time stamp
    const results = kafkaData; // results here is an array
    const topicData = {};

    // Assign information in topicData to have a header of 'topic' (key)
    // Assign array of values to topic data (value)
    for (let j = 0; j < results.length; j++) {
      if (results[j].metric.topic) {
        topicData[results[j].metric.topic] = results[j].values;
      }
      else if (results[j].metric.aggregate) {
        topicData[results[j].metric.aggregate] = results[j].values;
      }
      else if (results[j].metric.client_id) {
        topicData[results[j].metric.client_id] = results[j].values;
      }
      else if (results[j].metric.service) {
        topicData[results[j].metric.service] = results[j].values;
      }
    }

    // need to update for labels (time) and data (metric)
    // parse through valueArray and house our timestampArr and metricsArr
    const lineChartData = []
    const timestampArr = [];
    let metricsArr = [];
    let timeArrBuilt = false;
    // iterating through out object
    for (let [topic, value] of Object.entries(topicData)) {
      for (let i = 0; i < value.length; i++) { // { topic: [timestamp , another time] }
        if (!timeArrBuilt) {
          let currDate = new Date(Number(value[i][0]) * 1000).toLocaleTimeString(); // mult by 1000 given value comes in as seconds
          let splittedString = currDate.split(":");
          currDate = splittedString.slice(0, -1).join(':') + splittedString[2].slice(-2);
          timestampArr.push(currDate);
        }
        metricsArr.push(Number(value[i][1]));
      }
      // given times for all metrics are the same after pull, only aggregate once
      timeArrBuilt = true;

      lineChartData.push({
        label: topic,
        data: metricsArr,
        // parsing: false,
        borderColor: getRandomColor()
      });
      // reset for next topic
      metricsArr = [];
    }
    return [timestampArr, lineChartData]
  }

  useEffect(() => {
    // for mockdata
    // const [timestampArr, lineChartData] = convertKafkatoChart(mock1h.data.result)
    const [timestampArr, lineChartData] = convertKafkatoChart(chartData)
    // set our state - updateLine with our new time stamps and metrics data
    updateLine({
      // labels will be for date -> most likely going to do a cache arr as date.time
      labels: timestampArr,
      datasets: lineChartData, // this is an array of 3 subarrays -> subarray [line data]
    });

    setOptions({ 
      ...options,
      plugins: {
        legend: {
          labels: {
            font : {
              family: 'Trebuchet MS',
            },
          },
          position: 'top',
        },
        title: {
          display: true,
          text: chartData[0].metric.__name__,
        },
      } 
    })

  }, [props])

  return (
    <>
      <Line id='lineGraph' 
        options={options} 
        data={chartMetric} 
      />
    </>
  )
}

export default LineChart;
