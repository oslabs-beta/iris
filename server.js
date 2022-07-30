import client from 'prom-client';
import express from 'express'

const app = express();


const register = new client.Registry();
client.collectDefaultMetrics({
    app: 'iris',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});



app.get('/metrics/', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    const data = await register.getSingleMetricAsString('node_process_cpu_user_seconds_total');
    console.log('inside prom client serverjs', data, typeof data)
});

app.listen(8080, () => console.log('Server is running on http://localhost:8080, metrics are exposed on http://localhost:8080/metrics'));