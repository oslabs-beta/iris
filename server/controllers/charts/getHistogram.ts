import queryData from '../util/queryData'
import { Results, Values } from '../../types'

//Method to get histogram 
const getHistogram = async (metric : String, timeFrame : String, numOfBins : number) : Promise<Results> => {
  const data = await queryData(metric, timeFrame); // data = [...[time,values]] 

  if (!data || data.length <= 0) return []

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

export default getHistogram;