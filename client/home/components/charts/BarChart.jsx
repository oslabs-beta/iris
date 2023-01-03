import React, { Component, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h copy.js';
import io from 'socket.io-client';

const socket = io();

function BarChart(props) {
  const { chartID } = props;

  const [title, setTitle] = useState('Hourly Distribution')
  const [barData, setBarData] = useState({ labels: [], datasets: [] });

  socket.on(chartID, (data) => {
    if (data.metric !== title) setTitle(data.metric)
    setBarData(data);
  });

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