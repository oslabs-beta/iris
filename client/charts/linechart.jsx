import React, { Component, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import mock1h from './dummyData/mockData_1h.json' assert {type: 'json'};
import mock6h from './dummyData/mockData_6h.json' assert {type: 'json'};

// no need for axios request, will be passed as props later

function LineGraph(props) {
    // need to update for labels (time) and data (metrics) when props is received
    const [lineChartMetric, updateLine] = useState({
        labels: ["filler"], // change for axis
        datasets: [
            {
                labels: "filler",
                data: ["0"],
                borderColor: "gray"
            }
        ]
    });

    // manipulate our 1 hour data for now
    // we need to convert our unix timestamps to regular time stamps
    // need to create an array to house our metrics, correlated to specific time stamp
    const valueArray = mock1h.data.result[0].values;
    console.log(valueArray.length);

    // parse through valueArray and house our timestampArr and metricsArr
    const timestampArr = [];
    const metricsArr = [];

    for (let i = 0; i < valueArray.length; i++) {
        timestampArr.push(
            new Date(Number(valueArray[i][0]) * 1000).toLocaleString() // mult by 1000 given valueArray comes in as seconds
        );
        metricsArr.push(Number(valueArray[i][1]));
    }

    // set our state - updateLine with our new time stamps and metrics data
    updateLine({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: timestampArr,
        datasets: [
            {
                label: "Price",
                data: metricsArr,
                borderColor: "gray"
            }
        ]
    });

    return <Line id="graph" data={lineChartMetric} />;
}

export default LineGraph;


/*

// metrics housed in state and also for our chartjs plots
const [currMetrics, setMetrics] = useState();

// grab data - currently dummyData from process_cpu_user_seconds_total
// fetch request to our query - using prom client
const metric = 'process_cpu_user_seconds_total'
async function getNewMetrics(metric) {
    let data = [];

    // need the endpoint - most likely will be {ip}:5556/query..{metric}
    axios.get(`localhost:5556/${metric}`)
        .then(data => setMetrics(data))
        .catch(err => console.log(`some error occurred while grabbing data from ${metric}: ${err}`));

    // modify for time and metrics - boilerplate for now
    updateLine({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: Object.keys(currMetrics).reverse(),
        datasets: [{
            label: 'Price',
            data: Object.values(currMetrics).map(data => Number.data),
            borderColor: "gray",
        }],
    })

}

//metric will be modifiable
setInterval(getNewMetrics(metric), 3000);

*/
