/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');
const { BASE_PATH, PROM_QUERY } = require('config');
const { dbModel } = require('../../models');

const add_failedisrupdatespersec = async (lastTimeStamp) => {
  try {
    const res = await fetch(`${BASE_PATH}${PROM_QUERY}kafka_server_replica_manager_failedisrupdatespersec[5m]`);
    const data = await res.json();
    const results = data.data.result;
    const sqlArr = []; // Array of {key, identifier, metric, time, value}
    let time;
    results.forEach((result) => {
      const identifier = result.metric.aggregate;
      const metric = result.metric.__name__;
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
    });

    if (sqlArr.length > 0) {
      // Validate against data in db to prevent error
      await dbModel.bulkCreate(sqlArr, { validate: true });
    }
  } catch (err) {
    console.log('ERROR: add_failedisrupdatespersec', err);
  }
};

module.exports = add_failedisrupdatespersec