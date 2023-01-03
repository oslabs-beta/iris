import queryData from '../util/queryData'
import { LineChart, Dataset } from '../../types'

// function to generate random colors for our chartjs lines
const getRandomColor = () => {
  let color = 'rgb(52,153,'
  color += String(Math.floor(Math.random()*100)+150) + ','
  color += String(Math.random()*0.60+0.30) + ')'

  return color;
}

//Method to get histogram 
const getLineChart = async (metric : String, timeFrame : String) : Promise<LineChart> => {
  const results = await queryData(metric, timeFrame);

  if (!results || results.length <= 0) return {
    metric: metric, 
    chartData: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ]
    }
  };

  // Get time stamp labels for x-axis
  const timeStampArr = results[0].values.map(value => {
    let currDate = new Date(Number(value[0]) * 1000).toLocaleTimeString()
    let splittedString = currDate.split(":");
    currDate = splittedString.slice(0, -1).join(':') + splittedString[2].slice(-2);
    return currDate
  })

  const dataset: Dataset[] = []
  results.forEach(result => {
    // Assign data label based on hierarchy of choice
    let label;
    if (result.metric.topic) label = result.metric.topic;
    else if (result.metric.aggregate) label = result.metric.aggregate;
    else if (result.metric.client_id) label = result.metric.client_id;
    else if (result.metric.service) label = result.metric.service;

    const metricsArr = result.values.map(value => Number(value[1]))

    dataset.push({
      label: label,
      data: metricsArr,
      borderColor: getRandomColor()
    });
  })

  return { 
    metric: metric, 
    chartData: {
      labels: timeStampArr, 
      datasets: dataset 
    }
  };
}

export default getLineChart;