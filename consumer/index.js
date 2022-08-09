console.log('consumer running')

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

const consumer = kafka.consumer({groupId:'iris'})

consumer.connect()

consumer.subscribe({
  topics:['test1', 'test2'],
  fromBeginning: true
})

consumer.run({
  eachMessage: async({topic, partition, message}) => {
    if (topic === 'test1') {
      console.log('received message: ', eventInteger.fromBuffer(message.value))
    }
    else if (topic === 'test2') {
      console.log('receieved message: ', {
        value: message.value.toString(),
      })
    }
  }
})

/**
 * Implementation with node-rdkafka npm module
 */
// import Kafka from 'node-rdkafka';
// import eventType from '../eventType.js';

// const consumer1 = Kafka.KafkaConsumer({
//   'group.id':'kafka101',
//   'metadata.broker.list': 'localhost:9092'
// }, {});

// consumer1.connect();

// consumer1.on('ready', () => {
//   console.log('consumer1 ready...')
//   consumer1.subscribe(['test1']);
//   consumer1.consume();
// }).on('data', (data) => {
//   console.log('received message: ', eventType.fromBuffer(data.value))
// })


// const consumer2 = Kafka.KafkaConsumer({
//   'group.id':'kafka101',
//   'metadata.broker.list': 'localhost:9092'
// }, {});

// consumer2.connect();

// consumer2.on('ready', () => {
//   console.log('consumer2 ready...')
//   consumer2.subscribe(['test2']);
//   consumer2.consume();
// }).on('data', (data) => {
//   console.log('received message: ', eventType.fromBuffer(data.value))
// })