import getHistogram from "./getHistogram";
import queryData from "../util/queryData";

import { Results } from '../../types'

jest.mock('../util/queryData');

const mockQueryData = queryData as jest.MockedFunction<typeof queryData>

const goodResponse = [
  [ 1672452359.169, "250132352" ],
  [ 1672452374.171, "210368896" ],
  [ 1672452389.171, "244971904" ],
  [ 1672452404.172, "205235648" ],
  [ 1672452419.171, "238790080" ],
  [ 1672452434.173, "273393088" ],
  [ 1672452449.173, "233595736" ],
  [ 1672452464.169, "267150168" ],
  [ 1672452479.17, "224334016" ],
  [ 1672452494.17, "258937024" ],
  [ 1672452509.171, "212927808" ],
  [ 1672452524.171, "247530816" ],
  [ 1672452539.174, "282133824" ],
  [ 1672452554.172, "236030536" ],
  [ 1672452569.172, "269584968" ],
  [ 1672452584.178, "237275728" ],
  [ 1672452599.175, "206929080" ],
  [ 1672452614.169, "241532088" ],
  [ 1672452629.171, "211184800" ],
  [ 1672452644.171, "244739232" ]
]
const emptyResponse = []
const nullResponse = null

describe('Testing getHistogram', () => {
  it('Returns an empty array when queryData response is null', async () => {
    (mockQueryData as jest.Mock).mockResolvedValue(goodResponse)
    const result: Results = await getHistogram('test', '0', 3)
    expect(result[0].values.length).toBe(3);
  })
  
  it('Returns an empty array when queryData response is null', async () => {
    (mockQueryData as jest.Mock).mockResolvedValue(nullResponse)
    const result = await getHistogram('test', '0', 0)
    expect(result).toStrictEqual([])
  })

  it('Returns an empty array when queryData response is empty', async () => {
    (mockQueryData as jest.Mock).mockResolvedValue(emptyResponse)
    const result = await getHistogram('test', '0', 0)
    expect(result).toStrictEqual([])
  })

})