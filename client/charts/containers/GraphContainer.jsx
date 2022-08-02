import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import LineChart from '../components/LineChart.jsx';

function GraphContainer(props) {
  // handle onChange for dropdown

  async function handleClick() {
    // store for return
    let results;

    // grab metric by pulling value from our select id
    const metrics = JSON.parse(document.getElementById('metric').value);
    const timeFrame = JSON.parse(document.getElementById('timeframe').value);

    if (metrics === 'noChoice' || timeFrame === 'noChoice') { 
      alert("Must Choose a Metric")
    }
    else {
      const reqBody = {
        metric: metrics,
        timeFrame: timeFrame,
        // chartID: , need to implement this somehow
      }
    }

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
      })
      .then(data => data.json())
      .then((formattedData) => {
          console.log(formattedData)
          results = formattedData;
      })
      .catch(err => {
          console.log('Error thrown in POST request in graphContainer: ', err)
      })

    return results;
  }

  // return our render
  // need 2 drop downs -> 1) metrics, 2) timeframe
  return (
    <div id='graphContainer'>

      <div className="selectDropdown">
        {/* metrics */}
        <select className='metric'>
          <option value="noChoice">Metric</option>
          {/* histogram unless specified both hist/pie */}
          <option value="kafka_server_replica_fetcher_manager_maxlag_value" onClick={handleClick}>Kafka Replica Fetcher Manager Max Lag</option >
          <option value="kafka_server_request_handler_avg_idle_percent" onClick={handleClick}>Kafka Request Handler Average Idle Percentage</option>
          <option value="kafka_server_replica_manager_offlinereplicacount" onClick={handleClick}>Kafka Replica Manager Offline Replica Count</option>
          <option value="kafka_server_replica_fetcher_manager_failedpartitionscount_value" onClick={handleClick}>Kafka Replica Fetcher Manager Failed Partitions Count</option >
          <option value="kafka_server_broker_topic_metrics_bytesinpersec_rate" onClick={handleClick}>Kafka Broker Topic Metrics Bytes In Per Sec</option>
          <option value="kafka_server_broker_topic_metrics_bytesoutpersec_rate" onClick={handleClick}>Kafka Broker Topic Metrics Bytes Out Per Sec</option>
          <option value="kafka_jvm_heap_usage" onClick={handleClick}>Kafka JVM Heap Usage</option >
          <option value="kafka_jvm_non_heap_usage" onClick={handleClick}>Kafka JVM Non-Heap Usage</option>
          <option value="kafka_server_broker_topic_metrics_messagesinpersec_rate" onClick={handleClick}>Kafka Broker Topic Metrics Messages In Per Sec</option>
          <option value="kafka_network_request_metrics_time_ms" onClick={handleClick}>{`Kafka Network Request Time (ms)`}</option >
          <option value="kafka_server_broker_topic_metrics_replicationbytesinpersec_rate" onClick={handleClick}>Kafka Broker Topic Metrics replication bytes In Per Sec</option>
          <option value="kafka_server_replica_manager_underreplicatedpartitions" onClick={handleClick}>Kafka Replica Manager Under Replicated Partitions</option>
          <option value="kafka_server_replica_manager_failedisrupdatespersec" onClick={handleClick}>Kafka Replica Manager Failed Updates Per Second</option>
          {/* prometheus connection health */}
          <option value="scrape_duration_seconds" onClick={handleClick}>{`Scrape Duration (seconds)`}</option>
          <option value="scrape_samples_scraped" onClick={handleClick}>{`Samples Scraped`}</option>
          {/* pie chart metrics */}
          <option value="kafka_coordinator_group_metadata_manager_numgroups" onClick={handleClick}>Kafka Number of Metadata Groups</option>
          <option value="kafka_coordinator_group_metadata_manager_numgroupsdead" onClick={handleClick}>Kafka Number of Dead Metadata Groups</option>
          <option value="kafka_coordinator_group_metadata_manager_numgroupsempty" onClick={handleClick}>Kafka Number of Empty Metadata Groups</option>
        </select>

        {/* timeframe */}
        <select className='timeframe'>
          <option value="noChoice">Timeframe</option>
          <option value="1m" onClick={handleClick}>1m</option>
          <option value="5m" onClick={handleClick}>5m</option>
          <option value="15m" onClick={handleClick}>15m</option>
          <option value="30m" onClick={handleClick}>30m</option>
          <option value="1h" onClick={handleClick}>1h</option>
          <option value="2h" onClick={handleClick}>2h</option>
          <option value="4h" onClick={handleClick}>4h</option>
          <option value="6h" onClick={handleClick}>6h</option>
          <option value="12h" onClick={handleClick}>12h</option>
        </select>
      </div>

      <LineChart />
    </div>
  )
}

export default GraphContainer;