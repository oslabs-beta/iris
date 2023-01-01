import React, { Component, useState } from 'react';
import io from 'socket.io-client';

const socket = io();

function NumberContainer(props) {

  const [topicCount, setTopicCount] = useState(0);
  const [partitionCount, setPartitionCount] = useState(0);
  const [topicArr, setTopicArr] = useState([]);

  socket.on('numbers', (numbers) => {
    setTopicCount(numbers[0])
    setPartitionCount(numbers[1])
    setTopicArr(numbers[2])
  });

  // return our render
  return (
    <div id='numberContainer'>
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
        <ul>{topicArr.map(topic => (
          <li>{topic}</li>
        ))}</ul>
      </div>
    </div>
  )
}

export default NumberContainer;