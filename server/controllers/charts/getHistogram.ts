import queryData from '../util/queryData'
import { BarChart, Values } from '../../types'

//Method to get histogram 
const getHistogram = async (metric : String, timeFrame : String, numOfBins : number) : Promise<BarChart> => {
  const data = await queryData(metric, timeFrame); // data = [...[time,values]] 

  if (!data || data.length <= 0) return {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ]
  };

  data.sort((a : Values, b: Values) => Number(a[1]) - Number(b[1])); //sort the data base on values
  const minValue = Number(data[0][1])
  const maxValue = Number(data[data.length - 1][1])
  const binRange = (maxValue - minValue) / numOfBins;

  const binArr: String[] = [];
  const countArr: Number[] = [];
  const colorArr: String[]= [];
  let currBin = Math.round(minValue + binRange);
  let currBinCount = 0;
  // let sum = 0
  let i = 0
  while (currBin <= maxValue && i < data.length) {
    if (Number(data[i][1]) <= currBin)(currBinCount === 0) ? currBinCount = 1 : currBinCount += 1
    else {
      binArr.push((Number(currBin)/1000000).toExponential(2))
      countArr.push(currBinCount)
      colorArr.push('rgb(52,153,204,0.5)')
      currBin += Math.round(binRange)
      currBinCount = 1
    }
    // sum += Number(data[i][1])
    i++
  }

  while (currBin <= maxValue) {
    binArr.push((Number(currBin)/1000000).toExponential(2))
    countArr.push(currBinCount)
    colorArr.push('rgb(52,153,204,0.5)')
    if (currBin !== 0) {
      currBinCount = 0
    }
    currBin += Math.round(binRange)
  }

  // // Generates line for average 
  // const linRegressArr: number[] = [];
  // countArr.forEach(() => linRegressArr.push(sum/countArr.length))

  const results = {
    metric: metric,
    labels: binArr,
    datasets: [
      {
        data: countArr,
        backgroundColor: colorArr,
        order: 1,
      },
      // {
      //   data: linRegressArr,
      //   backgroundColor: 'rgb(52,153,204)',
      //   borderColor: 'rgb(52,153,204)',
      //   type: 'line',
      //   pointRadius: 0
      // }
    ]
  };

  return results

}

export default getHistogram;