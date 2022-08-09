// const db = require('./databaseModel.js');
const db = require('./pg.ts');
const fetch = require('node-fetch')

const keys = {
  // metric: identifier
  kafka_server_broker_topic_metrics_bytesinpersec_rate: 'topic',
  kafka_server_replica_fetcher_manager_failedpartitionscount_value: 'client_id',
  kafka_server_replica_fetcher_manager_maxlag_value: 'client_id',
  kafka_server_replica_manager_offlinereplicacount: 'service',
  kafka_server_broker_topic_metrics_bytesoutpersec_rate: 'topic',
  kafka_server_broker_topic_metrics_messagesinpersec_rate: 'topic',
  kafka_server_broker_topic_metrics_replicationbytesinpersec_rate: 'service',
  kafka_server_replica_manager_underreplicatedpartitions: 'service',
  kafka_server_replica_manager_failedisrupdatespersec: 'aggregate',
  scrape_duration_seconds: 'job',
  scrape_samples_scraped: 'job',
  kafka_server_request_handler_avg_idle_percent: 'aggregate',
}

const dbController = {}

dbController.getHistoricalData = (req, res) => {
  const {metric, timeStart, timeEnd} = req.body

  const body = `SELECT * 
    FROM iris_database AS ib
    WHERE ib.time >= ${Math.floor(timeStart.getTime() / 1000)} 
      AND ib.time <= ${Math.floor(timeEnd.getTime() / 1000)}
      AND ib.metric = '${metric}'
  `

  db.query(body, (err, result) => {
    if (err) {
      return next(err);
    }
    console.log(result);
    // TODO: Format the data to pass in to the frontend graph
    /**
     * results: [
     *  {
     *    metric: {
     *      keys[metric]: identifier
     *    },
     *    values : [
     *      [time, value],
     *      [time, value], 
     *       ...
     *    ]
     *  }
     * ]
     */

    res.locals.historicalData = result
    return next();
  });
}

dbController.add_bytesinpersec_rate = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_bytesinpersec_rate[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        if (result.metric.topic) {
          const identifier = result.metric.topic;
          const metric = result.metric.__name__;
          for (let i = 0; i < result.values.length; i++) {
            const element = result.values[i] // element = [time, value]
            time = element[0];
            if (time > lastTimeStamp) { // 0 -> 1659801332.432 
              // console.log('time:', time,'timeStamp:', lastTimeStamp)
              const value = element[1];
              const key = `${identifier}%${metric}%${time}`;
              body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
            }
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
        return time
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
        return lastTimeStamp 
      }
    })
};

dbController.add_failedpartitionscount_value = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_replica_fetcher_manager_failedpartitionscount_value[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.client_id;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'

      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_maxlag_value = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_replica_fetcher_manager_maxlag_value[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      let time;
      results.forEach(result => {
        const identifier = result.metric.client_id;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_offlinereplicacount = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_replica_manager_offlinereplicacount[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.service;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_bytesoutpersec_rate = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_bytesoutpersec_rate[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        if (result.metric.topic) {
        const identifier = result.metric.topic;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      }
    })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_messagesinpersec_rate = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_messagesinpersec_rate[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        if (result.metric.topic) {
          const identifier = result.metric.topic;
          const metric = result.metric.__name__;
          for (let i = 0; i < result.values.length; i++) {
            const element = result.values[i] // element = [time, value]
            time = element[0];
            if (time > lastTimeStamp) { // 0 -> 1659801332.432 
              // console.log('time:', time,'timeStamp:', lastTimeStamp)
              const value = element[1];
              const key = `${identifier}%${metric}%${time}`;
              body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
            }
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_replicationbytesinpersec_rate = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_replicationbytesinpersec_rate[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.service;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_underreplicatedpartitions = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_replica_manager_underreplicatedpartitions[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.service;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_failedisrupdatespersec = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_replica_manager_failedisrupdatespersec[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.aggregate;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_scrapedurationseconds = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=scrape_duration_seconds[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.job;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_scrape_samples_scraped = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=scrape_samples_scraped[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.job;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

dbController.add_requesthandleraverageidlepercent = (lastTimeStamp) => {
  return fetch(`http://localhost:9090/api/v1/query?query=kafka_server_request_handler_avg_idle_percent[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO iris_database(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      // console.log('first run', lastTimeStamp)
      let time;
      results.forEach(result => {
        const identifier = result.metric.aggregate;
        const metric = result.metric.__name__;
        for (let i = 0; i < result.values.length; i++) {
          const element = result.values[i] // element = [time, value]
          time = element[0];
          if (time > lastTimeStamp) { // 0 -> 1659801332.432 
            // console.log('time:', time,'timeStamp:', lastTimeStamp)
            const value = element[1];
            const key = `${identifier}%${metric}%${time}`;
            body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
          }
        }
      })

      // Remove ', ' from last added string value
      body = body.slice(0,body.length-2)
      body+=';'
      
      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length-2] === ')') {
        db.query(body, (err,res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('Successfully written to db')
            // console.log('newTimeStamp: ', time)
          }
        })
      } 
      else {
        console.log('no new data uploaded to db at timeStamp: ', lastTimeStamp)
      }
    })
};

module.exports = dbController;



// switch (metric){
//   case 'kafka_server_broker_topic_metrics_bytesinpersec_rate':
//   case 'kafka_server_replica_fetcher_manager_failedpartitionscount_value':
//   case 'kafka_server_replica_fetcher_manager_maxlag_value':
//   case 'kafka_server_replica_manager_offlinereplicacount':
//   case 'kafka_server_broker_topic_metrics_bytesinpersec_rate': // no topic for the result[0]
//   case 'kafka_server_broker_topic_metrics_bytesoutpersec_rate': // no topic for the result[0]
//   case 'kafka_server_broker_topic_metrics_messagesinpersec_rate': // no topic for the result[0]
//   case 'kafka_server_broker_topic_metrics_replicationbytesinpersec_rate':
//   case 'kafka_server_replica_manager_underreplicatedpartitions':
//   case 'kafka_server_replica_manager_failedisrupdatespersec':
//   case 'scrape_duration_seconds': // no topic at all => frontEnd will default to "job": "kafka"
//   case 'scrape_samples_scraped': // no topic at all => frontEnd will default to "job": "kafka"
//       // console.log('switch case ', metric, data.data.result)    
//       return data.data.result
//   case 'kafka_server_request_handler_avg_idle_percent': // no topic at all => frontEnd will default to "job": "kafka"
//       // console.log('kafka_server_request_handler_avg_idle_percent: ', [data.data.result[4]])
//       return [data.data.result[4]]
// }