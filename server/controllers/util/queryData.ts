import fetch from 'node-fetch'
import config from 'config'

import { Results } from '../../types'

const BASE_PATH = config.get('BASE_PATH')
const PROM_QUERY = config.get('PROM_QUERY')

const queryData = async (metric : String, timeFrame : String) : Promise<any | Results> => {
  const res = await fetch(`${BASE_PATH}${PROM_QUERY}${metric}[${timeFrame}]`, { method: 'get' })
  const data = await res.json()
  switch (metric) {
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':              // Linechart
    case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value':  // Linechart
    case 'kafka_server_replica_fetcher_manager_maxlag_value':                 // Linechart
    case 'kafka_server_replica_manager_offlinereplicacount':                  // Linechart
    case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':              // Linechart
    case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate':             // Linechart
    case 'kafka_server_broker_topic_metrics_messagesinpersec_rate':           // Linechart
    case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate':   // Linechart
    case 'kafka_server_replica_manager_underreplicatedpartitions':            // Linechart
    case 'kafka_server_replica_manager_failedisrupdatespersec':               // Linechart
    case 'scrape_duration_seconds':                                           // Linechart
    case 'scrape_samples_scraped':                                            // Linechart
    case 'kafka_coordinator_group_metadata_manager_numgroups':                // Piechart
    case 'kafka_coordinator_group_metadata_manager_numgroupsdead':            // Piechart 
    case 'kafka_coordinator_group_metadata_manager_numgroupsempty':           // Piechart
      return data.data?.result;
    case 'kafka_server_request_handler_avg_idle_percent':                     // Linechart
      return [data.data?.result[4]];
    case 'kafka_jvm_heap_usage':                                              // Histogram
    case 'kafka_jvm_non_heap_usage':                                          // Histogram
      return data.data?.result[3]?.values;
    default:
      return null;
  }
};

export default queryData;