import { Request, Response } from 'express'
import { Router } from 'express'

import { updateChart, deleteChart } from './chartCache'
import dbController from '../controllers/database'
import portController from '../controllers/portController.js'

const router = Router()

router.get('/health', (req, res) => {
  res.sendStatus(200)
})

//------------------------------------------------------------------------------------------------------------//
//Post request to frontend to show historical data for each Metric Chart
router.post('/historicalData', dbController.getHistoricalData)

//------------------------------------------------------------------------------------------------------------//
// Post request to frontend to delete chart
router.post('/delete',
  (req : Request, res : Response) : void  => {
    const { chartID } = req.body;
    const { metric, timeFrame } = deleteChart(chartID)
    if (metric == '' || timeFrame == '') res.status(500).json('ERROR: Failed to remove chart')
    res.status(200).json(`SUCCESS: Chart with metric: ${metric} and time frame: ${timeFrame} removed`)
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
  const { metric, timeFrame, chartID } = req.body
  const updatedChart = updateChart(chartID, metric, timeFrame)
  res.status(200).send(`SUCCESS: Metric updated to ${updatedChart.metric}. Time frame updated to ${updatedChart.timeFrame}`)
})

export default router;
