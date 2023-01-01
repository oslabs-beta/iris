import getNumbers from "./getNumbers";
import fetch from "node-fetch"

import { Numbers } from '../../types'

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

const firstResponse = {
  data: {
    result: [
      { value: ['test', '1'] },
    ]
  }
}
const secondResponse = {
  data: {
    result: [
      { value: ['test', '2'] },
    ]
  }
}
const thirdResponse = {
  data: {
    result: [
      { metric: { topic: 'test1' } },
      { metric: { topic: 'test2' } },
      { metric: { topic: 'test3' } }
    ]
  }
}

describe('Testing getNumbers', () => {
  it('Returns correct types in correct order', async () => {
    (mockFetch as unknown as jest.Mock)
      .mockResolvedValueOnce(new Response(JSON.stringify(firstResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(secondResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(thirdResponse)))
    const result: Numbers[] = await getNumbers(['test1', 'test2', 'test3'])
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
    expect(Array.isArray(result[2])).toBe(true);
  })

  it('Returns correct transformed values', async () => {
    (mockFetch as unknown as jest.Mock)
      .mockResolvedValueOnce(new Response(JSON.stringify(firstResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(secondResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(thirdResponse)))
    const result: Numbers[] = await getNumbers(['test1', 'test2', 'test3'])
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    for (let i = 0 ; i < 3; i++) {
      expect(result[2][i]).toBe(`test${i+1}`)
    }
  })

  it('Returns empty reponse if error on fetch', async () => {
    (mockFetch as unknown as jest.Mock)
      .mockResolvedValueOnce(new Response(new Error))
    const result: Numbers[] = await getNumbers(['test1', 'test2', 'test3'])
    expect(result[0]).toBe(NaN);
    expect(result[1]).toBe(NaN);
    expect(result[2]).toStrictEqual([])
  })
})