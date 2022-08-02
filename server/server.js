const express = require('express')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const PORT = 8080

const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './index.html'));
});

io.on('connection', socket => {
    console.log('a user connected')

    // socket.on('message', message => {
    //     console.log(message)
    //     io.emit('message', )
    // })
})

server.listen(PORT, () => console.log('Listening on Port', PORT))



// const register = new client.Registry();
// client.collectDefaultMetrics({
//     app: 'iris',
//     prefix: 'kafka_controller_',
//     timeout: 10000,
//     gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
//     register
// });

// app.get('/metrics/', async (req, res) => {
//     res.setHeader('Content-Type', register.contentType);
//     // const data = await register.getSingleMetric('node_process_cpu_user_seconds_total');
//     const data = await register.metrics()
//     console.log('register metrics: ', data)
//     // console.log('inside prom client serverjs', data, typeof data)
//     res.send(data)
// });

// app.listen(8080, () => console.log('Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics'));