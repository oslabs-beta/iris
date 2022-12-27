const db = require('../pg.ts'); 
const keys = require('./metricKeys')

const { DB_TABLE } = require('config')

const getHistoricalData = async (req, res) => {
  const { metric, startTime, endTime } = req.body

  const body = `SELECT * 
    FROM ${DB_TABLE} AS ib
    WHERE ib.time >= ${startTime} 
      AND ib.time <= ${endTime}
      AND ib.metric = '${metric}'
  `

  const results = [];

  // Query db for results and push to results array
  await db.query(body, (err, queryResults) => {
    if (err) {
      console.log('ERROR in PostgreSQL read for historical data')
      return err;
    }
    const rows = queryResults.rows
    const resultsObj = {}

    // Iterate over each row of SQL data
    // el refers to an individual row
    rows.forEach(el => {
      if (!resultsObj[el.identifier]) resultsObj[el.identifier] = [[el.time, el.value]]
      else if (resultsObj[el.identifier]) resultsObj[el.identifier].push([el.time, el.value])
    })

    // Iterate over each identifier to reconstruct Prometheus data object for Chart.js
    // Identifier includes within SQL database!
    for (const identifier in resultsObj) {
      const obj = {}
      obj.metric = {}
      obj.metric[keys[metric]] = identifier
      obj.values = resultsObj[identifier]
      results.push(obj)
    }
    
  });

  return results
}

module.exports = getHistoricalData