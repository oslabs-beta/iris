import queryData from '../util/queryData'

type Results = { metric: {}, values: (Values[] | HistogramValues[] | PieValues[])}[]
type Values = [number, String]
type HistogramValues = [String, unknown]
type PieValues = [number, String]

const getPieChart = async (metricsArr : String[]) : Promise<Results> => {
  const results = await (metricsArr.map(async (metric) => {
    const data = await queryData(metric, '30s'); // Results array of objects with metric and values keys
    const timeValueArr = data[0]?.values[data[0].values.length - 1] // [time, value] at values.length - 1
    return {
      metric: { topic: metric },
      values: [timeValueArr]
    }
  }))
  return await Promise.all(results)
}

export default getPieChart;