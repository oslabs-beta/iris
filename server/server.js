const express = require('express')
const fetch = require('node-fetch')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const { urlencoded } = require('express')
const cors = require('cors')
const dbController = require('./databaseController.js')

const PORT = 8080
// const io = require('socket.io');
//------------------------------------------------------------------------------------------------------------//
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
//------------------------------------------------------------------------------------------------------------//


// Send index.html at app load
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

//------------------------------------------------------------------------------------------------------------//
//Define default chart value
let chartsData = {
  '1': {
    metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
    timeFrame : '5m', 
  }
};
//------------------------------------------------------------------------------------------------------------//
// creating Socket.io Connection
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  },
})

//------------------------------------------------------------------------------------------------------------//
// Connecting with Socket.io and sending data socket.emit to the front end
io.on('connection', async (socket) => {
  console.log('a user connected')
  for (const [chartID, query] of Object.entries(chartsData)){
    const data = await queryData(query.metric, query.timeFrame)
    socket.emit(chartID, data) //Broadcast data from query on topic of chartID
  }
  //setInterval is for sending data to the frontend every X seconds.
  setInterval(async () => {
    for (const [chartID, query] of Object.entries(chartsData)){
      const data = await queryData(query.metric, query.timeFrame)
      socket.emit(chartID, data) //Broadcast data from query on topic of chartID
      socket.on("disconnect", () => console.log("Socket disconnect")) // disconnects socket to grab new metric data
    }
  }, 5000) // socket.emit will send the data every fifteen second. 
})

//------------------------------------------------------------------------------------------------------------//
// Checking for socket.io error
io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//------------------------------------------------------------------------------------------------------------//
// Query data from API endpoint and write data to database
// Existing database is not overwritten and does not present conflicts 
// LastTimeStamp variable tracked to check the last time data was queried and written
let lastTimeStamp = 0;
//setInterval to query data and store in backend every 15s.
setInterval(async () => {
  setTimeout(async() => {
    await dbController.add_failedpartitionscount_value(lastTimeStamp);
    await dbController.add_maxlag_value(lastTimeStamp);
    await dbController.add_bytesoutpersec_rate(lastTimeStamp);
    console.log('db after 0 sec')
  }, 0)

  setTimeout(async() => {
    await dbController.add_messagesinpersec_rate(lastTimeStamp);
    await dbController.add_replicationbytesinpersec_rate(lastTimeStamp);
    await dbController.add_underreplicatedpartitions(lastTimeStamp);
    console.log('db after 2 sec')
  }, 2000)
  
  setTimeout(async() => {
    await dbController.add_failedisrupdatespersec(lastTimeStamp);
    await dbController.add_scrapedurationseconds(lastTimeStamp);
    await dbController.add_scrape_samples_scraped(lastTimeStamp);
    console.log('db after 4 sec')
  }, 4000)

  setTimeout(async() => {
    await dbController.add_requesthandleraverageidlepercent(lastTimeStamp)
    lastTimeStamp = await dbController.add_bytesinpersec_rate(lastTimeStamp)
    console.log('in setInterval after dbController new time:', lastTimeStamp)
    console.log('db after 6 sec')
  }, 6000)    
  
}, 15000)

//------------------------------------------------------------------------------------------------------------//
// Reassign metric and timeframe based on OnChange event from frontEnd
app.post('/', (req,res) => {
  const metric = req.body.metric;
  const timeFrame = req.body.timeFrame;
  const chartID = req.body.chartID 
  const updatedChart = {}
  updatedChart[chartID] = { metric: metric, timeFrame: timeFrame }
  chartsData = Object.assign(chartsData, updatedChart)
  res.status(200).send('Metric and timeFrame changed')
})

//------------------------------------------------------------------------------------------------------------//
//Making different switch cases for each metric to retrieve data
const queryData = async (metric, timeFrame) => {
  const res = await fetch(`http://localhost:9090/api/v1/query?query=${metric}[${timeFrame}]`)
  const data = await res.json()
  switch (metric){
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':
    case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value':
    case 'kafka_server_replica_fetcher_manager_maxlag_value':
    case 'kafka_server_replica_manager_offlinereplicacount':
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate': 
    case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate': 
    case 'kafka_server_broker_topic_metrics_messagesinpersec_rate': 
    case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate':
    case 'kafka_server_replica_manager_underreplicatedpartitions':
    case 'kafka_server_replica_manager_failedisrupdatespersec':
    case 'scrape_duration_seconds': 
    case 'scrape_samples_scraped': 
      return data.data.result
    case 'kafka_server_request_handler_avg_idle_percent': 
      return [data.data.result[4]]
  }
};

//------------------------------------------------------------------------------------------------------------//
//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


//------------------------------------------------------------------------------------------------------------//
//PORT listening
server.listen(PORT, () => console.log('Listening on Port', PORT))


module.exports = app;

























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