import React, { Component, useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h copy.js';
import io from 'socket.io-client';

const socket = io();

function BarChart(props) {

    const { chartID } = props;
    // const [barData, setBarData] = useState({
    //     // labels will be for date -> most likely going to do a cache arr as date.time
    //     labels: [],
    //     datasets: [
    //         {
    //             label: chartID,
    //             data: [],
    //             backgroundColor: []
    //         }
    //     ],
    // });

    socket.on('connect', () => {
        console.log('socket connected')
    });

    socket.on(chartID, (data) => {
        console.log('socket received data: ', data)
        // const [binArray, countArr] = convertKafkatoChart(data)
        // // set our state - updateLine with our new time stamps and metrics data
        // const newObj = Object.assign(barData, {
        //     // labels will be for date -> most likely going to do a cache arr as date.time
        //     labels: binArray,
        //     datasets: {
        //         labels: chartID,
        //         data: countArr,
        //         borderColor: 
        //     }
        // })
        setBarData(newObj);
        console.log('after setting chartData: ', barData)
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
        // console.log("line 50 inside BarChart for topicData.metric:", topicData[data[0].metric.topic])
        const binArray = []
        const countArr = []
        const colorArr = []
        topicData[data[0].metric.topic].forEach(element => {
            binArray.push(new Date(Number(element[0]) * 1000).toLocaleTimeString());
            // countArr.push({
            //     label: chartID,
            //     data: element[1],
            //     // borderColor: getRandomColor()
            // });
            countArr.push(Number(element[1]))
            colorArr.push(getRandomColor())
        })
        return [binArray, countArr, colorArr]
    }

    const [binArray, countArr, colorArr] = convertKafkatoChart(mock1h.data.result)

    const [barData, setBarData] = useState({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: binArray,
        datasets: [
            {
                label: chartID,
                data: countArr,
                backgroundColor: colorArr
            }
        ],
    });

    // useEffect(() => {
    //     // for mockdata
    //     const [binArray, countArr, colorArr] = convertKafkatoChart(mock1h.data.result)
    //     // console.log('binArr: ', binArray);
    //     // console.log('countArr: ', countArr);

    //     // set our state - updateLine with our new time stamps and metrics data
    //     setBarData({
    //         // labels will be for date -> most likely going to do a cache arr as date.time
    //         labels: binArray,
    //         // datasets: countArr
    //         datasets: [
    //             {
    //                 labels: chartID,
    //                 data: countArr,
    //                 backgroundColor: colorArr
    //             }
    //         ]
    //     });
    // }, [props])

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
    };

    return (
        <>
            <Bar id='barGraph' options={options} data={barData} />
        </>
    )
}


export default BarChart;