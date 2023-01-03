import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function LineChart({ metric, chartData }) {
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
        text: '',
      },
    } 
  })

  useEffect(() => {
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
          text: metric,
        },
      } 
    })

  }, [metric])

  return (
    <>
      <Line id='lineGraph' 
        options={options} 
        data={chartData} 
      />
    </>
  )
}

export default LineChart;
