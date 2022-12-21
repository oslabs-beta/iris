
import { Socket } from "socket.io-client"
import { Request, Response } from 'express'
import { NextFunction } from "webpack-dev-server"

import express from 'express'
import fetch from 'node-fetch'
import path from 'path'
import http from 'http'
import cors from 'cors'
import dbController from './controllers/databaseController.js'
import portController from './controllers/portController.js'

import BASE_PATH from '../config/default'

// import writeCSV from "./latencyTest/writeCSV.js"

const PORT = 8080

//------------------------------------------------------------------------------------------------------------//
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//------------------------------------------------------------------------------------------------------------//


// Send index.html at app load
app.get('/', (req: Request, res: Response): void => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

//------------------------------------------------------------------------------------------------------------//
//Define default chart value
type ChartQuery = {
  metric: String,
  timeFrame: String
}

type ChartsList = {
  [key: string]: ChartQuery
}

let chartsData : ChartsList = {
  '1': {
    metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
    timeFrame: '5m',
  }
};
//------------------------------------------------------------------------------------------------------------//
// creating Socket.io Connection

type CORS = {
  origin: string[],
  methods?: string[],
  allowedHeaders?: string[],
  credentials?: Boolean, 
  ExposeHeaders?: string[],
}

type SocketConfig = {
  cors: CORS
}

const IOConfig : SocketConfig = {
  cors: {
    origin: ["*"],
  },
}

const server = http.createServer(app)
const io = require('socket.io')(server, IOConfig)

//------------------------------------------------------------------------------------------------------------//
// Connecting with Socket.io and sending data socket.emit to the front end
io.on('connection', async (socket : Socket) : Promise<void> => {
  console.log('a user connected' , socket.id)
  //Histogram connection
  const JVMHeapUsage = await getHistogram('kafka_jvm_heap_usage', '1h', 20)
  const JVMNonHeapUsage = await getHistogram('kafka_jvm_non_heap_usage', '1h', 20);
  socket.emit('kafka_jvm_heap_usage', JVMHeapUsage)
  socket.emit('kafka_jvm_non_heap_usage', JVMNonHeapUsage)
  
  //Piechart connection
  const pieChartData = await getPieChart(['kafka_coordinator_group_metadata_manager_numgroups',
    'kafka_coordinator_group_metadata_manager_numgroupsdead',
    'kafka_coordinator_group_metadata_manager_numgroupsempty'
  ])
  socket.emit('pieChart', pieChartData);

  //Line chart connection
  for (const [chartID, query] of Object.entries(chartsData)) {
    const data = await queryData(query.metric, query.timeFrame)
    socket.emit(chartID, data) //Broadcast data from query on topic of chartID
    socket.on("disconnect", () : void => console.log("Socket disconnect for linecharts first start up"))
  }
  
  // setInterval is for sending data to the frontend every X seconds.
  setInterval(async () : Promise<void> => {
    // Query and emit data for JVM_HEAP_USAGE (HISTOGRAM) and JVM_NON_HEAP_USAGE (HISTOGRAM)
    const JVMHeapUsage = await getHistogram('kafka_jvm_heap_usage', '1h', 20)
    const JVMNonHeapUsage = await getHistogram('kafka_jvm_non_heap_usage', '1h', 20);
    socket.emit('kafka_jvm_heap_usage', JVMHeapUsage)
    socket.emit('kafka_jvm_non_heap_usage', JVMNonHeapUsage)

    const pieChartData = await getPieChart(['kafka_coordinator_group_metadata_manager_numgroups',
      'kafka_coordinator_group_metadata_manager_numgroupsdead',
      'kafka_coordinator_group_metadata_manager_numgroupsempty'
    ])
    socket.emit('pieChart', pieChartData);


    //caching the data to fix latency problem
    const queryObj = {}
    //query and emit data for linecharts
    for (const [chartID, query] of Object.entries(chartsData)) {
      const key = JSON.stringify(`${query.metric}+${query.timeFrame}`) // 'kafka_coordinator_group_metadata_manager_numgroups+5m'
      if (queryObj[key]) {
        socket.emit(chartID, queryObj[key]) //Broadcast data from query on topic of chartID
      } else {
        const data = await queryData(query.metric, query.timeFrame)
        queryObj[key] = data //setting data as value for key
        socket.emit(chartID, data) //Broadcast data from query on topic of chartID
      }
    }
  }, 5000) // socket.emit will send the data every n second. 
})

//------------------------------------------------------------------------------------------------------------//
// Checking for socket.io error
io.on('connect_error', (err : Error) : void => {
  console.log(`connect_error due to ${err.message}`);
});

//------------------------------------------------------------------------------------------------------------//
//*THIS BLOCKS ARE FOR ADDING METRICS DATA TO THE DATABASE */
// Query data from API endpoint and write data to database
// Existing database is not overwritten and does not present conflicts 
// LastTimeStamp variable tracked to check the last time data was queried and written
let lastTimeStamp = 0;
// setInterval to query data and store in backend every 15s.
setInterval(async () : Promise<void> => {
  const start = Date.now();
  await Promise.allSettled([
    dbController.add_failedpartitionscount_value(lastTimeStamp),
    dbController.add_maxlag_value(lastTimeStamp),
    dbController.add_bytesoutpersec_rate(lastTimeStamp),
    dbController.add_messagesinpersec_rate(lastTimeStamp),
    dbController.add_replicationbytesinpersec_rate(lastTimeStamp),
    dbController.add_underreplicatedpartitions(lastTimeStamp),
    dbController.add_failedisrupdatespersec(lastTimeStamp),
    dbController.add_scrapedurationseconds(lastTimeStamp),
    dbController.add_scrape_samples_scraped(lastTimeStamp),
    dbController.add_requesthandleraverageidlepercent(lastTimeStamp)
  ])
  // writeCSV(path.resolve(__dirname, './latencyTest/PromiseAll_AWS.csv'), {
  //   'id': lastTimeStamp,
  //   'duration(s)': Date.now() - start,
  // })
  lastTimeStamp = await dbController.add_bytesinpersec_rate(lastTimeStamp)
}, 30000)// 1 minute set interval

//------------------------------------------------------------------------------------------------------------//
//Post request to frontend to show historical data for each Metric Chart
app.post('/historicalData',
  dbController.getHistoricalData,
  (req : Request, res : Response) : void => {
    res.status(200).json(res.locals.historicalData)
  })

//------------------------------------------------------------------------------------------------------------//
// Post request to frontend to delete chart
app.post('/delete',
  (req : Request, res : Response) : void  => {
    const { chartID } = req.body;
    delete chartsData[chartID]
    res.status(200).json('ChartID was removed')
  }
)

//------------------------------------------------------------------------------------------------------------//
// Post request from frontend to verify port and password
app.post('/port',
  portController.verifyPort,
  (req : Request, res : Response) => {
    res.status(201).json(res.locals.port)
  }
)

//------------------------------------------------------------------------------------------------------------//
// Create a port and password combo in backend via Postman
app.post('/createPort',
  portController.createPort,
  (req : Request, res : Response) : void => {
    res.status(201).json(res.locals.port)
  }
)

//------------------------------------------------------------------------------------------------------------//
// Reassign metric and timeframe based on OnChange event from frontEnd
app.post('/', (req : Request, res : Response) : void => {
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
type Results = { metric: {}, values: (Values[] | HistogramValues[] | PieValues[])}[]
type Values = [number, String]
type HistogramValues = [String, unknown]
type PieValues = [number, String]

const queryData = async (metric : String, timeFrame : String) : Promise<any | Results> => {
  const res = await fetch(BASE_PATH + `/api/v1/query?query=${metric}[${timeFrame}]`)
  const data = await res.json()
  switch (metric) {
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':              // Linechart
    case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value':  // Linechart
    case 'kafka_server_replica_fetcher_manager_maxlag_value':                 // Linechart
    case 'kafka_server_replica_manager_offlinereplicacount':                  // Linechart
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':              // Linechart
    case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate':             // Linechart
    case 'kafka_server_broker_topic_metrics_messagesinpersec_rate':           // Linechart
    case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate':   // Linechart
    case 'kafka_server_replica_manager_underreplicatedpartitions':            // Linechart
    case 'kafka_server_replica_manager_failedisrupdatespersec':               // Linechart
    case 'scrape_duration_seconds':                                           // Linechart
    case 'scrape_samples_scraped':                                            // Linechart
    case 'kafka_coordinator_group_metadata_manager_numgroups':                // Piechart
    case 'kafka_coordinator_group_metadata_manager_numgroupsdead':            // Piechart 
    case 'kafka_coordinator_group_metadata_manager_numgroupsempty':           // Piechart
      return data.data.result
    case 'kafka_server_request_handler_avg_idle_percent':                     // Linechart
      return [data.data.result[4]]
    case 'kafka_jvm_heap_usage':                                              // Histogram
    case 'kafka_jvm_non_heap_usage':                                          // Histogram
      return data.data.result[3].values;
    default:
      return
  }
};

//------------------------------------------------------------------------------------------------------------//
//Method to get histogram 
const getHistogram = async (metric : String, timeFrame : String, numOfBins : number) : Promise<Results> => {
  const data = await queryData(metric, timeFrame); // data = [...[time,values]] 
  data.sort((a : Values, b: Values) => Number(a[1]) - Number(b[1])); //sort the data base on values
  const minValue = Number(data[0][1])
  const maxValue = Number(data[data.length - 1][1])
  const binRange = (maxValue - minValue) / numOfBins;
  const histogram = {}
  let currBin = Math.round(minValue + binRange);
  data.forEach((num : Values[]):void => {
    if (Number(num[1]) <= currBin) {
      if (!histogram[currBin]) histogram[currBin] = 1
      else histogram[currBin] += 1
    }
    else currBin += Math.round(binRange)
  })
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
const getPieChart = async (metricsArr : String[]) : Promise<Results> => {
  const results = await (metricsArr.map(async (metric) => {
    const data = await queryData(metric, '30s'); // Results array of objects with metric and values keys
    const timeValueArr = data[0].values[data[0].values.length - 1] // [time, value] at values.length - 1
    return {
      metric: { topic: metric },
      values: [timeValueArr]
    }
  }))
  return await Promise.all(results)
}

//------------------------------------------------------------------------------------------------------------//
//global error handler
type ServerError = { 
  log: String,
  status: number,
  message: Message,
}

type Message = {
  err: String
}

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
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
