import React, { Component, useState, useEffect } from 'react';

function NumberContainer(props) {

  const [topicArr, setTopicArr] = useState([]);
  const [topicCount, setTopicCount] = useState(0);
  const [partitionCount, setPartitionCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      fetch('http://localhost:9090/api/v1/query?query=kafka_controller_globaltopiccount')
        .then(res => res.json())  
        .then(data => {
          
          setTopicCount(Number(data.data.result[0].value[1]))
        })
        .catch(err => {
          console.log('Error thrown in GET request in numberContainer: ', err)
        })
      fetch('http://localhost:9090/api/v1/query?query=kafka_controller_globalpartitioncount')
        .then(res => res.json())  
        .then(data => {
          setPartitionCount(Number(data.data.result[0].value[1]))
        })
        .catch(err => {
          console.log('Error thrown in GET request in numberContainer globalPartitionCount: ', err)
        })
      fetch('http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_bytesinpersec_rate')
        .then(res => res.json())  
        .then(data => {
          const arr = []
          for (let i = 0; i < data.data.result.length; i++) {
            if (data.data.result[i].metric.topic){
              arr.push(<li>{data.data.result[i].metric.topic}</li>)
            }
          }
          setTopicArr(arr)
        })
        .catch(err => {
          console.log('Error thrown in GET request in numberContainer topicMetrics: ', err)
        })
    }, 5000)
  }, [])

  // return our render
  return (
    <div id='numberContainer' data-testid='number-container'>
      <div className="partitionCount">
        <h1>Partition Count:</h1>
        <h1 className='metric'>{partitionCount}</h1>
      </div>
      <div className="topicCount">
        <h1>Topic Count:</h1>
        <h1 className='metric'>{topicCount}</h1>
      </div>
      <div className="topicArr">
        <h1>Current Topics:</h1>
        <ul>{topicArr}</ul>
      </div>
    </div>
  )
}

export default NumberContainer;