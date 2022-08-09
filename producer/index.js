console.log('producer running')

const { Kafka } = require("kafkajs")
const eventInteger = require('../eventTypes/eventInteger.js')

const kafka = new Kafka({
  clientId:'iris',
  brokers:['localhost:9092'],
  requestTimeout: 25000,
  connectionTimeout: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: 'logLevel.DEBUG'
})

const producer = kafka.producer({
  allowAutoTopicCreation: true,
})

producer.connect().then(() => console.log('producer connected'))

const test1 = {integer: 3000}

setInterval(() => {
  producer.send({
    topic:'test1',
    messages:[
      { value: eventInteger.toBuffer(test1)}
    ]
  })
  .then(res => {
    console.log('Message sent: ', res)
  })
}, 3000);

setInterval(() => {
  producer.send(
    {
      topic:'test2',
      messages:[
        { value: 'second yolo'}
      ]
    }
  )
    .then(res => {
      console.log('Message sent: ', res)
    })
}, 2000);


/**
 * Implementation with node-rdkafka npm module
 */
// import Kafka from 'node-rdkafka';
// import eventType from '../eventType.js';

// const stream1 = Kafka.Producer.createWriteStream({
//   'metadata.broker.list': 'localhost:9092'
// }, {}, {topic: 'test1'})

// const stream2 = Kafka.Producer.createWriteStream({
//   'metadata.broker.list': 'localhost:9092'
// }, {}, {topic: 'test2'})

// function queueMessage() {
//   const event1 = { category: 'DOG', noise: 'bark' };
//   const event2 = { category: 'CAT', noise: 'meow' };
//   const success1 = stream1.write(eventType.toBuffer(event1))
//   const success2 = stream1.write(eventType.toBuffer(event2))
//   return (success1 && success2) ? console.log('Successful message') : console.log('Something went wrong')
// }

// setInterval(() => {
//   queueMessage();
// }, 3000);