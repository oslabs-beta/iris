import React, { Component, useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h';

function PieChart(props) {
    const { chartID } = props;
    const [pieData, setPieData] = useState({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: [0],
        datasets: [
            {
                label: chartID,
                data: [0],
                backgroundColor: ['#000000']
            },
        ],
    });

    socket.on('connect', () => {
        console.log('socket connected')
    });

    socket.on(chartID, (data) => {
        // console.log('socket received data: ', data)
        const [binArray, countArr, colorArr] = convertKafkatoChart(data)
        const newObj = {
            label: binArray,
            datasets: [{
                label: chartID, // label not showing up here //fuck you Walter you fucking name it label'S'!!!!!
                data: countArr,
                borderColor: colorArr,
            }]
        };
        setPieData(newObj);
        // console.log('after setting pieData: ', pieData)
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
        // console.log("line 64 inside PieChart for topicData.metric:", topicData[data[0].metric.topic])
        const binArray = [];
        const countArr = [];
        const colorArr = [];
        topicData[data[0].metric.topic].forEach(element => {
            binArray.push(Number(element[0]))
            countArr.push(Number(element[1]))
            colorArr.push(getRandomColor())
        })

        return [binArray, countArr, colorArr]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'TOP SECRET: ITAR RESTRICTED DATA',
            },
        },
    };

    return (
        <div id='pieGraph'>
            <Pie id='pieGraph' options={options} data={pieData} />
        </div>
    )
}

export default PieChart;