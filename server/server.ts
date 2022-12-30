
import { Socket } from "socket.io-client"
import { Request, Response } from 'express'
import { NextFunction } from "webpack-dev-server"

import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'

import chartCache from "./routes/chartCache"
import dbController from './controllers/database'
import portController from './controllers/portController.js'
import queryData from './controllers/util/queryData'
import getHistogram from './controllers/charts/getHistogram'
import getPieChart from './controllers/charts/getPieChart'
import router from './routes'

dotenv.config()

// import path from 'path'
// import writeCSV from "./latencyTest/writeCSV.js"

const PORT = process.env.PORT || 8000

//------------------------------------------------------------------------------------------------------------//
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)

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
  console.log('SUCCESS: a Socket connected with id' , socket.id)
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
  for (const [chartID, query] of Object.entries(chartCache)) {
    const data = await queryData(query.metric, query.timeFrame)
    socket.emit(chartID, data) //Broadcast data from query on topic of chartID
    socket.on("disconnect", () : void => console.log("ALERT: a Socket disconnected for linecharts"))
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
    for (const [chartID, query] of Object.entries(chartCache)) {
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
  console.log(`ERROR: connect_error due to ${err.message}`);
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
