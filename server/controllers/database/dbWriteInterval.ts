//------------------------------------------------------------------------------------------------------------//
//*THIS BLOCKS ARE FOR ADDING METRICS DATA TO THE DATABASE */
// Query data from API endpoint and write data to database
// Existing database is not overwritten and does not present conflicts 
// LastTimeStamp variable tracked to check the last time data was queried and written

// import path from 'path'
// import writeCSV from "./latencyTest/writeCSV.js"
import dbController from './index'

const dbWriteInterval = (time: number): void => {
  let lastTimeStamp = 0;
  // setInterval to query data and store in backend every 15s.
  setInterval(async () : Promise<void> => {
    const start = Date.now();
    await Promise.allSettled([
      dbController.add_failedpartitionscount_value(lastTimeStamp),
      dbController.add_maxlag_value(lastTimeStamp),
      dbController.add_bytesoutpersec_rate(lastTimeStamp),
      dbController.add_messagesinpersec_rate(lastTimeStamp),
      dbController.add_replicationbytesinpersec_rate(lastTimeStamp),
      dbController.add_underreplicatedpartitions(lastTimeStamp),
      dbController.add_failedisrupdatespersec(lastTimeStamp),
      dbController.add_scrapedurationseconds(lastTimeStamp),
      dbController.add_scrape_samples_scraped(lastTimeStamp),
      dbController.add_requesthandleraverageidlepercent(lastTimeStamp)
    ])
    // writeCSV(path.resolve(__dirname, './latencyTest/PromiseAll_AWS.csv'), {
    //   'id': lastTimeStamp,
    //   'duration(s)': Date.now() - start,
    // })
    lastTimeStamp = await dbController.add_bytesinpersec_rate(lastTimeStamp)
    console.log('SUCCESS: Data written to database')
  }, time)
}

export default dbWriteInterval;