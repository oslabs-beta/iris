/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');
const { BASE_PATH, PROM_QUERY } = require('config');
const metricKeys = require('./metricKeys')
const { dbModel } = require('../../models');

const dbAdd = async (metric, intvl, lastTimeStamp) => {
  try {
    const res = await fetch(`${BASE_PATH}${PROM_QUERY}${metric}[${intvl}]`);
    const data = await res.json();
    const results = data.data.result;

    let time;
    const sqlArr = []; // Array of {key, identifier, metric, time, value}
    results.forEach((result) => {
      if (result.metric[metricKeys[metric]]) {
        const identifier = result.metric[metricKeys[metric]]
        let value;
        let key;
        result.values.forEach((val) => {
          time = val[0];
          if (time > lastTimeStamp) {
            value = val[1];
            key = `${identifier}%${metric}%${time}`;
          }
        });
        sqlArr.push({
          key,
          identifier,
          metric,
          time,
          value,
        });
      }
    });

    if (sqlArr.length > 0) {
      // Validate against data in db to prevent error
      await dbModel.bulkCreate(sqlArr, { validate: true });
      return time;
    }
  } catch (err) {
    console.log(`ERROR: Writing ${metric} to database`, err);
  }

  return lastTimeStamp;
};

module.exports = dbAdd;
