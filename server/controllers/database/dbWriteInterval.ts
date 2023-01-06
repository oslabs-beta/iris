//------------------------------------------------------------------------------------------------------------//
// Query data from API endpoint and write data to database
// Existing database is not overwritten and does not present conflicts 
// LastTimeStamp variable tracked to check the last time data was queried and written

// import path from 'path'
// import writeCSV from "./latencyTest/writeCSV.js"
import metricKeys from './metricKeys';
import dbAdd from './dbAdd';

const dbWriteInterval = (time: number): void => {
  let lastTimeStamp = 0;
  // setInterval to query data and store in backend every 15s.
  setInterval(async () : Promise<void> => {
    const start = Date.now();
    await Promise.allSettled([
      dbAdd("kafka_server_replica_fetcher_manager_failedpartitionscount_value", "5m", lastTimeStamp),
      dbAdd("kafka_server_replica_fetcher_manager_maxlag_value", "5m", lastTimeStamp),
      dbAdd("kafka_server_replica_manager_offlinereplicacount", "5m", lastTimeStamp),
      dbAdd("kafka_server_broker_topic_metrics_bytesoutpersec_rate", "5m", lastTimeStamp),
      dbAdd("kafka_server_broker_topic_metrics_messagesinpersec_rate", "5m", lastTimeStamp),
      dbAdd("kafka_server_broker_topic_metrics_replicationbytesinpersec_rate", "5m", lastTimeStamp),
      dbAdd("kafka_server_replica_manager_underreplicatedpartitions", "5m", lastTimeStamp),
      dbAdd("kafka_server_replica_manager_failedisrupdatespersec", "5m", lastTimeStamp),
      dbAdd("scrape_duration_seconds", "5m", lastTimeStamp),
      dbAdd("scrape_samples_scraped", "5m", lastTimeStamp),
      dbAdd("kafka_server_request_handler_avg_idle_percent", "5m", lastTimeStamp),
    ])
    // writeCSV(path.resolve(__dirname, './latencyTest/PromiseAll_AWS.csv'), {
    //   'id': lastTimeStamp,
    //   'duration(s)': Date.now() - start,
    // })
    lastTimeStamp = await dbAdd("kafka_server_broker_topic_metrics_bytesinpersec_rate", "5m", lastTimeStamp),
    console.log('SUCCESS: Data written to database')
  }, time)
}

export default dbWriteInterval;