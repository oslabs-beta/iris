import { SocketConfig, ServerError } from './types'

import { Socket } from "socket.io-client"
import { Request, Response } from 'express'
import { NextFunction } from "webpack-dev-server"

import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'

import chartCache from "./routes/chartCache"
import dbWriteInterval from "./controllers/database/dbWriteInterval"
import queryData from './controllers/util/queryData'
import getHistogram from './controllers/charts/getHistogram'
import getPieChart from './controllers/charts/getPieChart'
import router from './routes'

dotenv.config()

const PORT = process.env.PORT || 8000

//------------------------------------------------------------------------------------------------------------//
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)

//------------------------------------------------------------------------------------------------------------//
// creating Socket.io Connection
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

// Data written on 30 sec interval
dbWriteInterval(30000) 

//------------------------------------------------------------------------------------------------------------//
// Global error handler
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log('ERROR: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


//------------------------------------------------------------------------------------------------------------//
//PORT listening
server.listen(PORT, () => console.log('Listening on Port', PORT))

export default app;
