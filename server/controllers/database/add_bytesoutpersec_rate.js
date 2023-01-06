/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
const fetch = require('node-fetch');
const { BASE_PATH, PROM_QUERY } = require('config');
const { dbModel } = require('../../models');

const add_bytesoutpersec_rate = async (lastTimeStamp) => {
  try {
    const res = await fetch(`${BASE_PATH}${PROM_QUERY}kafka_server_broker_topic_metrics_bytesoutpersec_rate[5m]`);
    const data = await res.json();
    const results = data.data.result;
    const sqlArr = []; // Array of {key, identifier, metric, time, value}
    let time;
    results.forEach((result) => {
      let identifier;
      let metric;
      let value;
      let key;
      if (result.metric.topic) {
        identifier = result.metric.topic;
        metric = result.metric.__name__;
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
    }
  } catch (err) {
    console.log('ERROR: add_bytesoutpersec_rate', err);
  }
};

module.exports = add_bytesoutpersec_rate