console.log('consumer running')

const { Kafka } = require("kafkajs")
const eventInteger = require('../eventTypes/eventInteger.js')


const kafka = new Kafka({
  clientId: 'iris',
  brokers: ['localhost:9092'],
  requestTimeout: 25000,
  connectionTimeout: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  logLevel: 'logLevel.DEBUG'
})

const consumer = kafka.consumer({ groupId: 'iris' })

consumer.connect()

consumer.subscribe({
  topics: ['test1', 'test2'],
  fromBeginning: true
})

consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
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

