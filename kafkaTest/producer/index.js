console.log('producer running')

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
  // logLevel: 'logLevel.DEBUG'
})

const producer = kafka.producer({
  allowAutoTopicCreation: true,
})

producer.connect().then(() => console.log('producer connected'))

const test1 = { integer: 3000 }

setInterval(() => {
  producer.send({
    topic: 'test1',
    messages: [
      { value: eventInteger.toBuffer(test1) }
    ]
  })
    .then(res => {
      console.log('Message sent: ', res)
    })
}, 3000);

setInterval(() => {
  producer.send(
    {
      topic: 'test2',
      messages: [
        { value: 'second yolo' }
      ]
    }
  )
    .then(res => {
      console.log('Message sent: ', res)
    })
}, 2000);


