const fetch = require('node-fetch');

const db = require('./pg.ts'); 

const { BASE_PATH, DB_TABLE, PROM_QUERY } = require('config')

const add_scrapedurationseconds = (lastTimeStamp) => {
  return fetch(`${BASE_PATH}${PROM_QUERY}scrape_duration_seconds[5m]`)
    .then(res => res.json())
    .then(data => {
      let body = `
        INSERT INTO ${DB_TABLE}(key, identifier, metric, time, value)
        VALUES `;
      //key = identifier + metric + time 
      const results = data.data.result;
      let time;
      results.forEach(result => {
        const identifier = result.metric.job;
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
      body = body.slice(0, body.length - 2)
      body += ';'

      // Handle if there are no available data to record and db.query tries to write an empty body
      if (body[body.length - 2] === ')') {
        db.query(body, (err, res) => {
          if (err) {
            console.log('dbController.add_scrapedurationsecondscannot overwrite data in AWS')
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

module.exports = add_scrapedurationseconds