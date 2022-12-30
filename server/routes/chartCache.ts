import { LegendToggle } from "@mui/icons-material";

type ChartQuery = {
  metric: string,
  timeFrame: string
}

type ChartsList = {
  [key: string]: ChartQuery
}

let chartCache : ChartsList = {
  '1': {
    metric: 'kafka_server_broker_topic_metrics_bytesinpersec_rate',
    timeFrame: '5m',
  }
};

export const updateChart = (chartID: string, metric: string, timeFrame: string): ChartQuery => {
  const updatedChart = {}
  updatedChart[chartID] = { metric: metric, timeFrame: timeFrame }
  chartCache = Object.assign(chartCache, updatedChart)
  return chartCache[chartID]
}

export const deleteChart = (chartID: string): ChartQuery => {
  let removedChart = { metric: '', timeFrame: ''}
  if (chartCache[chartID]) {
    removedChart = {...chartCache[chartID]}
    delete chartCache[chartID]
  }
  return removedChart
}

export default chartCache;