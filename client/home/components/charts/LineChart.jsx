import React, { Component, useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
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

    // function to generate random colors for our chartjs lines
    function getRandomColor() {
        let letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function convertKafkatoChart(kafkaData) {
        // if kafkadata is null
        if (!kafkaData) return [[], []];

        // we need to convert our unix timestamps to regular time stamps
        // need to create an array to house our metrics, correlated to specific time stamp
        // console.log('kafkadata:', kafkaData)
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
                    timestampArr.push(
                        new Date(Number(value[i][0]) * 1000).toLocaleTimeString() // mult by 1000 given value comes in as seconds
                    );
                }
                metricsArr.push(Number(value[i][1]));
            }
            // given times for all metrics are the same after pull, only aggregate once
            timeArrBuilt = true;

            lineChartData.push({
                label: topic,
                data: metricsArr,
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

    }, [props])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'TOP SECRET: ITAR RESTRICTED DATA',
            },
        },
        background: 'rgba(0, 54, 0, 1)',
    }

    return (
        <>
            <Line id='lineGraph' options={options} data={chartMetric} />
        </>
    )
}

export default LineChart;
