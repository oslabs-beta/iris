import 'flatpickr/dist/themes/airbnb.css' // removes flatpicker backround
import React, { Component, useState, useEffect } from 'react';
import LineChart from '../components/charts/LineChart.jsx';
import io from 'socket.io-client';
import mock1h from '../dummyData/mockData_1h';
import e from 'cors';
import Flatpickr from "react-flatpickr"


const socket = io();

function LineGraphContainer(props) {
  // Exposed props.chartID when creating chart at Page Level Component
  // Use dummy value of '1' for unit testing
  const { chartID } = props;
  const [chartData, setChartData] = useState(mock1h.data.result);

  socket.on(chartID, (data) => {
    setChartData(data)
  });

  async function handleDynamicMetrics(e) {
    // grab metric by pulling value from our select id
    const metrics = e.target.parentNode.querySelector('#metric').value;
    const timeFrame = e.target.parentNode.querySelector('#timeframe').value;

    let reqBody;

    // FIX CHART ID 
    if (metrics === '' && timeFrame === '') {
      alert("Must Choose a Metric and Timeframe")
      return;
    }
    if (metrics !== '' && timeFrame === '') {
      reqBody = {
        metric: metrics,
        timeFrame: '5m',
        chartID: chartID
      }
    }
    else if (metrics === '' && timeFrame !== '') {
      reqBody = {
        metric: 'kafka_server_replica_fetcher_manager_maxlag_value',
        timeFrame: timeFrame,
        chartID: chartID
      }
    }
    else {
      reqBody = {
        metric: metrics,
        timeFrame: timeFrame,
        chartID: chartID
      }
    }

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody)
    })
      .then((formattedData) => {
        
      })
      .catch(err => {
        console.log('Error thrown in POST request in graphContainer: ', err)
      })

    // breakout of function
    return;
  }

  function handleChartDelete(e) {
    // need to target the chart with chartID 
    // more like deleting graphContainer
    const chartToDelete = e.target.parentNode.parentNode.parentNode
    // remove from DOM
    chartToDelete.remove();

    console.log(JSON.stringify({ chartID: chartID }));

    // fetch request with POST to backend so backend can process the socket.off    
    fetch('/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartID: chartID })
    })
      .then(res => res.json())
      .then((data) => {

      })
      .catch(err => {
        console.log('Error thrown in POST request  in graphContainer: ', err)
      })
    // no return;
  }

  // return our render
  // need 2 drop downs -> 1) metrics, 2) timeframe
  return (
    <div id='graphContainer'>

      <div className="selectDropdown">
        {/* metrics */}
        <select id='metric' onChange={(e) => handleDynamicMetrics(e)}>
          <option value="">Metric</option>
          {/* histogram unless specified both hist/pie */}
          <option value="kafka_server_replica_fetcher_manager_maxlag_value" >Kafka Replica Fetcher Manager Max Lag</option >
          <option value="kafka_server_request_handler_avg_idle_percent" >Kafka Request Handler Average Idle Percentage</option>
          <option value="kafka_server_replica_manager_offlinereplicacount" >Kafka Replica Manager Offline Replica Count</option>
          <option value="kafka_server_replica_fetcher_manager_failedpartitionscount_value" >Kafka Replica Fetcher Manager Failed Partitions Count</option >
          <option value="kafka_server_broker_topic_metrics_bytesinpersec_rate" >Kafka Broker Topic Metrics Bytes In Per Sec</option>
          <option value="kafka_server_broker_topic_metrics_bytesoutpersec_rate" >Kafka Broker Topic Metrics Bytes Out Per Sec</option>
          {/* <option value="kafka_jvm_heap_usage" >Kafka JVM Heap Usage</option >
          <option value="kafka_jvm_non_heap_usage" >Kafka JVM Non-Heap Usage</option> */}
          <option value="kafka_server_broker_topic_metrics_messagesinpersec_rate" >Kafka Broker Topic Metrics Messages In Per Sec</option>
          {/* <option value="kafka_network_request_metrics_time_ms" >{`Kafka Network Request Time (ms)`}</option > */}
          <option value="kafka_server_broker_topic_metrics_replicationbytesinpersec_rate" >Kafka Broker Topic Metrics replication bytes In Per Sec</option>
          <option value="kafka_server_replica_manager_underreplicatedpartitions" >Kafka Replica Manager Under Replicated Partitions</option>
          <option value="kafka_server_replica_manager_failedisrupdatespersec" >Kafka Replica Manager Failed Updates Per Second</option>
          {/* prometheus connection health */}
          {/* <option value="scrape_duration_seconds" >{`Scrape Duration (seconds)`}</option>
          <option value="scrape_samples_scraped" >{`Samples Scraped`}</option> */}
          {/* pie chart metrics */}
          {/* <option value="kafka_coordinator_group_metadata_manager_numgroups" >Kafka Number of Metadata Groups</option>
          <option value="kafka_coordinator_group_metadata_manager_numgroupsdead" >Kafka Number of Dead Metadata Groups</option>
          <option value="kafka_coordinator_group_metadata_manager_numgroupsempty" >Kafka Number of Empty Metadata Groups</option> */}
        </select>

        {/* timeframe */}
        <select id='timeframe' onChange={(e) => handleDynamicMetrics(e)}>
          <option value="">Timeframe</option>
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="30m">30m</option>
          <option value="1h">1h</option>
          <option value="2h">2h</option>
          <option value="4h">4h</option>
          <option value="6h">6h</option>
          <option value="12h">12h</option>
        </select>

        <button id="deleteGraph" onClick={(e) => handleChartDelete(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>


      <LineChart chartData={chartData} />

    </div>
  )
}

export default LineGraphContainer;