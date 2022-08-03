const express = require('express')
const fetch = require('node-fetch')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const { urlencoded } = require('express')
// const cors = require('cors')
const PORT = 8080

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//define metric and timeFrame. 
// Default chart 001 with 
let chartsData = {
    '001': {
        metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
        timeFrame : '5m', 
    }
}

//creating socket.io connection
const server = http.createServer(app)
const io = new Server(server)


// Send index.html at app load
app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

io.on('connection', async (socket) => {
    console.log('a user connected')
    for (const [chartID, query] of Object.entries(chartsData)){
        const data = await queryData(query.metric, query.timeFrame)
        console.log('query.metric, ' , query.metric, 'query Time frame,', query.timeFrame)
        console.log('Data from queryData, server.js: ', data, chartID)
        socket.emit(chartID, data) //Broadcast data from query on topic of chartID
    }

    setInterval(async () => {
        // function to query data
        for (const [chartID, query] of Object.entries(chartsData)){
            const data = await queryData(query.metric, query.timeFrame)
            console.log('query.metric, ' , query.metric, 'query Time frame,', query.timeFrame)
            console.log('Data from queryData, server.js: ', data, chartID)
            socket.emit(chartID, data) //Broadcast data from query on topic of chartID
        }
    }, 15000) // socket.emit will send the data every fifteen second. 
})

io.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
});



// Reassign metric and timeframe based on OnChange event from frontEnd
app.post('/', (req,res) => {
    const metric = req.body.metric;
    const timeFrame = req.body.timeFrame;
    const chartID = req.body.chartID 
    
    const updatedChart = {}
    updatedChart[chartID] = { metric: metric, timeFrame: timeFrame }
    chartsData = Object.assign(chartsData, updatedChart)
    // console.log('chartsData object assign, ' , chartsData)
    // console.log('metric, timeFrame in line 64 inside server.js', metric, timeFrame, chartID)
    res.status(200).send('Metric and timeFrame changed')
})

const queryData = async (metric, timeFrame) => {
    const res = await fetch(`http://localhost:9090/api/v1/query?query=${metric}[${timeFrame}]`)
    // console.log('Response from fetch: ', res)
    const data = await res.json()
    // console.log('data in line 67 inside server.js', data)

    switch (metric){
        case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':
        case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value':
        case 'kafka_server_replica_fetcher_manager_maxlag_value':
        case 'kafka_server_replica_manager_offlinereplicacount':
        case 'kafka_server_broker_topic_metrics_bytesinpersec_rate': // no topic for the result[0]
        case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate': // no topic for the result[0]
        case 'kafka_server_broker_topic_metrics_messagesinpersec_rate': // no topic for the result[0]
        case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate':
        case 'kafka_server_replica_manager_underreplicatedpartitions':
        case 'kafka_server_replica_manager_failedisrupdatespersec':
        case 'scrape_duration_seconds': // no topic at all => frontEnd will default to "job": "kafka"
        case 'scrape_samples_scraped': // no topic at all => frontEnd will default to "job": "kafka"
            console.log('switch case ', metric, data.data.result)    
            return data.data.result
        case 'kafka_server_request_handler_avg_idle_percent': // no topic at all => frontEnd will default to "job": "kafka"
            console.log('kafka_server_request_handler_avg_idle_percent: ', [data.data.result[4]])
            return [data.data.result[4]]
    }
}

/*
"metric": {
"__name__": "kafka_server_request_handler_avg_idle_percent",
"aggregate": "Count",
"env": "cluster-demo",
"instance": "jmx-kafka:5556",
"job": "kafka",
"service": "kafka-broker"
*/

/*
This is for scrape metrics:

"metric": {
"__name__": "scrape_samples_scraped",
"instance": "jmx-kafka:5556",
"job": "kafka"
 */

server.listen(PORT, () => console.log('Listening on Port', PORT))




























// const register = new client.Registry();
// client.collectDefaultMetrics({
//     app: 'iris',
//     prefix: 'kafka_controller_',
//     timeout: 10000,
//     gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
//     register
// });

// app.get('/metrics/', async (req, res) => {
//     res.setHeader('Content-Type', register.contentType);
//     // const data = await register.getSingleMetric('node_process_cpu_user_seconds_total');
//     const data = await register.metrics()
//     console.log('register metrics: ', data)
//     // console.log('inside prom client serverjs', data, typeof data)
//     res.send(data)
// });

// app.listen(8080, () => console.log('Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics'));