import React, { Component, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
// import axios from 'axios';
import mock1h from './dummyData/mockData_1h';
import mock6h from './dummyData/mockData_6h';

// no need for axios request, will be passed as props later

function LineChart(props) {
    const [lineChartMetric, updateLine] = useState({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: ['filler'],
        datasets: [
            {
                label: "filler",
                data: [0],
                borderColor: "gray"
            }
        ]
    });

    function convertKafkatoChart (kafkaData) {
         // we need to convert our unix timestamps to regular time stamps
        // need to create an array to house our metrics, correlated to specific time stamp
        const results = kafkaData.data.result; // results here is an array
        const topicData = {};

        // Assign information in topicData to have a header of 'topic' (key)
        // Assign array of values to topic data (value)
        for (let j = 0; j < results.length; j++) {
            if (results[j].metric.topic) {
                topicData[results[j].metric.topic] = results[j].values;
            }
        }
        
        // need to update for labels (time) and data (metric)
        // parse through valueArray and house our timestampArr and metricsArr
        const threeLineCharts = []
        const timestampArr = [];
        let metricsArr = [];
        // iterating through out object
        for (let [topic, value] of Object.entries(topicData)) {
            let timeArrBuilt = false;
            for (let i = 0; i < value.length; i++) { // { topic: [timestamp , another time] }
                if (!timeArrBuilt) {
                    timestampArr.push(
                        new Date(Number(value[i][0]) * 1000).toLocaleString() // mult by 1000 given value comes in as seconds
                    );
                }
                metricsArr.push(Number(value[i][1]));
            }
            threeLineCharts.push({
                label: topic,
                data: metricsArr
            });
            // reset for next topic
            metricsArr = [];
        }
        return [timestampArr, threeLineCharts]
    }

    
    useEffect(() => {
        const [timestampArr, threeLineCharts] = convertKafkatoChart(mock1h)

        // set our state - updateLine with our new time stamps and metrics data
        updateLine({
            // labels will be for date -> most likely going to do a cache arr as date.time
            labels: timestampArr,
            datasets: threeLineCharts // this is an array of 3 subarrays -> subarray [line data]
        });
    }, [])
    
    return <Line id="graph" data={lineChartMetric} />;
}

export default LineChart;
// module.exports = LineChart;

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
