import fetch from 'node-fetch'
import config from 'config'

import { Numbers } from '../../types'

const BASE_PATH = config.get('BASE_PATH')
const PROM_QUERY = config.get('PROM_QUERY')

const getNumbers = async (metricsArr: string[]): Promise<Numbers[]>  => {
  const results: Numbers[] = []
  for (let i = 0; i < 2; i++) {
    const res = await fetch(`${BASE_PATH}${PROM_QUERY}${metricsArr[i]}`, { method: 'get' });
    const data = await res.json();
    results.push(Number(data.data.result[0].value[1]));
  } 

  const res = await fetch(`${BASE_PATH}${PROM_QUERY}${metricsArr[2]}`, { method: 'get' });
  const data = await res.json();
  const arr: string[] = [];
  for (let i = 0; i < data.data.result.length; i++) {
    if (data.data.result[i].metric.topic){
      arr.push(data.data.result[i].metric.topic);
    }
  };
  results.push(arr);

  return results;
};

export default getNumbers;