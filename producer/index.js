console.log('producer running')

import Kafka from 'node-rdkafka';
import eventType from '../eventType.js';

const stream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': 'localhost:9092'
}, {}, {topic: 'test'})

function queueMessage() {
  const event = { category: 'DOG', noise: 'bark' };
  const success = stream.write(eventType.toBuffer(event))
  return (success) ? console.log('Successful message') : console.log('Something went wrong')
}

setInterval(() => {
  queueMessage();
}, 3000);