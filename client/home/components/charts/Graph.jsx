import React, { Component, useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import mock1h from '../../dummyData/mockData_1h';
import mock6h from '../../dummyData/mockData_6h';


// no need for axios request, will be passed as props later
function Graph(props) {
    // deconstruct chartData
    const { chartData } = props;

    const [GraphMetric, updateGraph] = useState({
        // labels will be for date -> most likely going to do a cache arr as date.time
        labels: ['filler'],
        datasets: [
            {
                label: "filler",
                data: [0],
                borderColor: "gray"
            }
        ],
        // config: {
        //     type: type,
        // }
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
        }

        // need to update for labels (time) and data (metric)
        // parse through valueArray and house our timestampArr and metricsArr
        const GraphData = []
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

            GraphData.push({
                label: topic,
                data: metricsArr,
                borderColor: getRandomColor()
            });
            // reset for next topic
            metricsArr = [];
        }
        return [timestampArr, GraphData]
    }

    useEffect(() => {
        // for mockdata
        // const [timestampArr, GraphData] = convertKafkatoChart(mock1h.data.result)
        const [timestampArr, GraphData] = convertKafkatoChart(chartData)

        // set our state - updateGraph with our new time stamps and metrics data
        updateGraph({
            // labels will be for date -> most likely going to do a cache arr as date.time
            labels: timestampArr,
            datasets: GraphData, // this is an array of 3 subarrays -> subarray [line data]
            // config: `${type}` // figure it out later for refactor
        });

        console.log(GraphMetric)
    }, [props])

    return <Line id="graph" data={GraphMetric} />;
}

export default Graph;

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
    updateGraph({
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
