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
app.use(express.urlencoded({ extended: true }))
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
    timeFrame: '5m',
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
  //Histogram connection
  // const JVMHeapUsage = await getHistogram('kafka_jvm_heap_usage', '1h', 20)
  // const JVMNonHeapUsage = await getHistogram('kafka_jvm_non_heap_usage', '1h', 20);
  // socket.emit('kafka_jvm_heap_usage', JVMHeapUsage)
  // socket.emit('kafka_jvm_non_heap_usage', JVMNonHeapUsage)
  
  //Piechart connection
  const pieChartData = await getPieChart(['kafka_coordinator_group_metadata_manager_numgroups',
                                          'kafka_coordinator_group_metadata_manager_numgroupsdead',
                                          'kafka_coordinator_group_metadata_manager_numgroupsempty'
                                          ])
  console.log('Data from getPieChart when connected: ', pieChartData)
  socket.emit('pieChart', pieChartData);

  //Line chart connection
  for (const [chartID, query] of Object.entries(chartsData)) {
    const data = await queryData(query.metric, query.timeFrame)
    socket.emit(chartID, data) //Broadcast data from query on topic of chartID
  }

  // setInterval is for sending data to the frontend every X seconds.
  setInterval(async () => {
    // Query and emit data for JVM_HEAP_USAGE (HISTOGRAM) and JVM_NON_HEAP_USAGE (HISTOGRAM)
    // const JVMHeapUsage = await getHistogram('kafka_jvm_heap_usage', '1h', 20)
    // const JVMNonHeapUsage = await getHistogram('kafka_jvm_non_heap_usage', '1h', 20);
    // socket.emit('kafka_jvm_heap_usage', JVMHeapUsage)
    // socket.emit('kafka_jvm_non_heap_usage', JVMNonHeapUsage)

    const pieChartData = await getPieChart(['kafka_coordinator_group_metadata_manager_numgroups',
                                            'kafka_coordinator_group_metadata_manager_numgroupsdead',
                                            'kafka_coordinator_group_metadata_manager_numgroupsempty'
                                            ])
    socket.emit('pieChart', pieChartData);
    
    //query and emit data for linecharts
    for (const [chartID, query] of Object.entries(chartsData)) {
      const data = await queryData(query.metric, query.timeFrame)
      socket.emit(chartID, data) //Broadcast data from query on topic of chartID
      socket.on("disconnect", () => console.log("Socket disconnect")) // disconnects socket to grab new metric data
    }
  }, 10000) // socket.emit will send the data every n second. 
})

//------------------------------------------------------------------------------------------------------------//
// Checking for socket.io error
io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//------------------------------------------------------------------------------------------------------------//
//*THIS BLOCKS ARE FOR ADDING METRICS DATA TO THE DATABASE */
// Query data from API endpoint and write data to database
// Existing database is not overwritten and does not present conflicts 
// LastTimeStamp variable tracked to check the last time data was queried and written
// let lastTimeStamp = 0;
//setInterval to query data and store in backend every 15s.
// setInterval(async () => {
//   setTimeout(async () => {
//     await dbController.add_failedpartitionscount_value(lastTimeStamp);
//     await dbController.add_maxlag_value(lastTimeStamp);
//     await dbController.add_bytesoutpersec_rate(lastTimeStamp);
//     // console.log('db after 0 sec')
//   }, 0)

//   setTimeout(async () => {
//     await dbController.add_messagesinpersec_rate(lastTimeStamp);
//     await dbController.add_replicationbytesinpersec_rate(lastTimeStamp);
//     await dbController.add_underreplicatedpartitions(lastTimeStamp);
//     // console.log('db after 2 sec')
//   }, 2000)

//   setTimeout(async () => {
//     await dbController.add_failedisrupdatespersec(lastTimeStamp);
//     await dbController.add_scrapedurationseconds(lastTimeStamp);
//     await dbController.add_scrape_samples_scraped(lastTimeStamp);
//     // console.log('db after 4 sec')
//   }, 4000)

//   setTimeout(async () => {
//     await dbController.add_requesthandleraverageidlepercent(lastTimeStamp)
//     lastTimeStamp = await dbController.add_bytesinpersec_rate(lastTimeStamp)
//     // console.log('in setInterval after dbController new time:', lastTimeStamp)
//     // console.log('db after 6 sec')
//   }, 6000)

// }, 60000)
//------------------------------------------------------------------------------------------------------------//
//Post request to frontend to show historical data for each Metric Chart
app.post('/historicalData',
  dbController.getHistoricalData,
  (req, res) => {
    const { chartID } = req.body
    io.emit(chartID, res.locals.historicalData)
    res.status(200).json(res.locals.historicalData)
  })
//------------------------------------------------------------------------------------------------------------//
//Post request to frontend to delete chart
app.post('/delete', 
  (req,res) => {
    const { chartID } = req.body;
    delete chartsData.chartID
    // console.log('ChartID was removed: ', (!chartsData[chartID]))
    res.status(200).send('ChartID was removed: ', (!chartsData[chartID]))
  }
)

//------------------------------------------------------------------------------------------------------------//
// Reassign metric and timeframe based on OnChange event from frontEnd
app.post('/', (req, res) => {
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
  switch (metric) {
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate': //linechart
    case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value'://linechart
    case 'kafka_server_replica_fetcher_manager_maxlag_value'://linechart
    case 'kafka_server_replica_manager_offlinereplicacount'://linechart
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate'://linechart
    case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate'://linechart
    case 'kafka_server_broker_topic_metrics_messagesinpersec_rate'://linechart
    case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate'://linechart
    case 'kafka_server_replica_manager_underreplicatedpartitions'://linechart
    case 'kafka_server_replica_manager_failedisrupdatespersec'://linechart
    case 'scrape_duration_seconds'://linechart
    case 'scrape_samples_scraped'://linechart
    case 'kafka_coordinator_group_metadata_manager_numgroups': //piechart
    case 'kafka_coordinator_group_metadata_manager_numgroupsdead': //piechart 
    case 'kafka_coordinator_group_metadata_manager_numgroupsempty': //piechart
      return data.data.result
    case 'kafka_server_request_handler_avg_idle_percent'://linechart
      return [data.data.result[4]]
    case 'kafka_jvm_heap_usage': //histogram
    case 'kafka_jvm_non_heap_usage'://histogram
      return data.data.result[3].values;
  }
};

//------------------------------------------------------------------------------------------------------------//
//Method to get histogram 
const getHistogram = async (metric, timeFrame, numOfBins) => {
  const data = await queryData(metric, timeFrame); // data = [...[time,values]] 
  data.sort((a, b) => a[1] - b[1]); //sort the data base on values
  const minValue = Number(data[0][1])
  const maxValue = Number(data[data.length - 1][1])
  const binRange = (maxValue - minValue) / numOfBins;

  const histogram = {}
  let sum = 0;
  let currBin = Math.round(minValue + binRange);
  data.forEach(num => {
    //finding the mean 
    sum += Number(num[1])
    if (num[1] <= currBin) {
      if (!histogram[currBin]) histogram[currBin] = 1
      else histogram[currBin] += 1
    }
    else currBin += Math.round(binRange)
  })

  const avg = Math.round(sum / data.length)
  const results = [
    {
      metric: {
        topic: metric
      },
      values: Object.entries(histogram)
    }
  ]

  return results
}

//------------------------------------------------------------------------------------------------------------//
//Method to get piechart 
const getPieChart = async (metricsArr) => {
  const results = await (metricsArr.map(async (metric) => {
    const data = await queryData(metric, '30s'); // Results array of objects with metric and values keys
    const timeValueArr = data[0].values[data[0].values.length - 1] // [time, value] at values.length - 1
    return {
      metric: {topic: metric},
      values: [timeValueArr]
    }
  }))
  return await Promise.all(results)
}

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
