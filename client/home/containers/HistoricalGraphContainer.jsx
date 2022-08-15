import 'flatpickr/dist/themes/airbnb.css' // removes flatpicker backround
import React, { Component, useState, useEffect } from 'react';
import LineChart from '../components/charts/LineChart.jsx';
import mock1h from '../dummyData/mockData_1h';
import Flatpickr from "react-flatpickr"

function HistoricalGraphContainer(props) {
  const { chartID } = props;
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [chartData, setChartData] = useState(mock1h.data.result);

  function handleChartDelete(e) {
    // need to target the chart with chartID 
    // more like deleting graphContainer
    const chartToDelete = e.target.parentNode.parentNode.parentNode
    // remove from DOM
    chartToDelete.remove();

    console.log(JSON.stringify({ chartID: chartID }));
  }

  async function handleHistorical(e) {
    console.log('starting historical metric fetch')
    
    const metric = e.target.parentNode.querySelector('#metric').value
    const startTime = (new Date(e.target.parentNode.querySelector('#startTime').value)).getTime() / 1000;
    const endTime = (new Date(e.target.parentNode.querySelector('#endTime').value)).getTime() / 1000;

    console.log('metric: ', metric)
    console.log('startTime: ', startTime)
    console.log('endTime: ', endTime)

    await fetch('/historicalData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { 
          metric: metric,
          startTime: startTime,
          endTime: endTime 
        }
      )
    })
      .then(res => res.json())
      .then((data) => {
        console.log('fetch post success')
        setChartData(data)
        console.log('setChartData: ', data)
      })
      .catch(err => {
        console.log('Error thrown in POST request  in graphContainer: ', err)
      })
     
  }
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
        </select>

        {/* need form and submit */}
        <Flatpickr
          id = 'startTime'
          data-enable-time
          options = {
            {
              minuteIncrement: 1
            }
          }
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Flatpickr
          id = 'endTime'
          data-enable-time
          options = {
            {
              minuteIncrement: 1
            }
          }
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
          <button id='submitTime' onClick={(e) => handleHistorical(e)}>Submit</button>

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

export default HistoricalGraphContainer;