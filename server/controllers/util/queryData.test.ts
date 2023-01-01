import fetch from 'node-fetch';

import { Results } from '../../types'
import queryData from './queryData';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

const goodResponse = {
  data: {
    result: true
  }
}
const idlePercentResponse = {
  data: {
    result: [0, 0, 0, 0, true]
  }
}

const heapUsageResponse = {
  data: {
    result: [0, 0, 0, { values: true }]
  }
}

const emptyResponse = []
const nullResponse = null

describe('Testing queryData', () => {  
  it('Returns null when metric does not exist', async () => {
    (mockFetch as unknown as jest.Mock).mockResolvedValue(new Response(JSON.stringify(nullResponse)))
    const result = await queryData('test', '0m')
    expect(result).toBe(null)
  })

  it('Returns correct response if metric matches', async () => {
    (mockFetch as unknown as jest.Mock).mockResolvedValue(new Response(JSON.stringify(goodResponse)))
    let result = await queryData('kafka_server_broker_topic_metrics_bytesinpersec_rate', '0m')
    expect(result).toBe(true)
  })

  it('Returns correct response for avg idle percent', async () => {
    (mockFetch as unknown as jest.Mock).mockResolvedValue(new Response(JSON.stringify(idlePercentResponse)))
    let result = await queryData('kafka_server_request_handler_avg_idle_percent', '0m')
    expect(result[0]).toBe(true)
  })

  it('Returns correct response for heap usage', async () => {
    (mockFetch as unknown as jest.Mock).mockResolvedValue(new Response(JSON.stringify(heapUsageResponse)))
    let result = await queryData('kafka_jvm_non_heap_usage', '0m')
    expect(result).toBe(true)
  })
})