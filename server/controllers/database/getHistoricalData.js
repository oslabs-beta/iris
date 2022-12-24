const db = require('../pg.ts'); 

const getHistoricalData = (req, res) => {
  const { metric, startTime, endTime } = req.body

  const body = `SELECT * 
    FROM ${DB_TABLE} AS ib
    WHERE ib.time >= ${startTime} 
      AND ib.time <= ${endTime}
      AND ib.metric = '${metric}'
  `
  db.query(body, (err, queryResults) => {
    if (err) {
      return next(err);
    }
    const rows = queryResults.rows
    const results = [];
    const resultsObj = {}

    // Iterate over each row of SQL data
    // el refers to an individual row
    rows.forEach(el => {
      if (!resultsObj[el.identifier]) resultsObj[el.identifier] = [[el.time, el.value]]
      else if (resultsObj[el.identifier]) resultsObj[el.identifier].push([el.time, el.value])
    })

    //indentifier includes within SQL database!
    for (const identifier in resultsObj) {
      const obj = {}
      obj.metric = {}
      obj.metric[keys[metric]] = identifier
      obj.values = resultsObj[identifier]
      results.push(obj)
    }
    res.locals.historicalData = results
    return next();
  });
}

module.exports = getHistoricalData