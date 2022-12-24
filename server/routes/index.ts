import { Request, Response } from 'express'
import { Router } from 'express'
import path from 'path'

import dbController from '../controllers/database'
import portController from '../controllers/portController.js'

const router = Router()

router.get('/health', (req, res) => {
  res.sendStatus(200)
})

// Send index.html at app load
router.get('/', (req: Request, res: Response): void => {
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

//------------------------------------------------------------------------------------------------------------//
//Post request to frontend to show historical data for each Metric Chart
router.post('/historicalData', dbController.getHistoricalData)

//------------------------------------------------------------------------------------------------------------//
// Post request to frontend to delete chart
router.post('/delete',
  (req : Request, res : Response) : void  => {
    const { chartID } = req.body;
    delete chartsData[chartID]
    res.status(200).json('ChartID was removed')
  }
)

//------------------------------------------------------------------------------------------------------------//
// Post request from frontend to verify port and password
// router.post('/port',
//   portController.verifyPort,
//   (req : Request, res : Response) => {
//     res.status(201).json(res.locals.port)
//   }
// )

// //------------------------------------------------------------------------------------------------------------//
// // Create a port and password combo in backend via Postman
// router.post('/createPort',
//   portController.createPort,
//   (req : Request, res : Response) : void => {
//     res.status(201).json(res.locals.port)
//   }
// )

//------------------------------------------------------------------------------------------------------------//
// Reassign metric and timeframe based on OnChange event from frontEnd
router.post('/', (req : Request, res : Response) : void => {
  const metric = req.body.metric;
  const timeFrame = req.body.timeFrame;
  const chartID = req.body.chartID
  const updatedChart = {}
  updatedChart[chartID] = { metric: metric, timeFrame: timeFrame }
  chartsData = Object.assign(chartsData, updatedChart)
  res.status(200).send('Metric and timeFrame changed')
})
