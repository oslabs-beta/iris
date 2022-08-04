const db = require('./databaseModel.js');
const fetch = require('node-fetch')

const dbController = {}

// let lastTimeStamp = 0
// if (currTime > lastTimeStamp) {
//   lastTimeStamp = currTime
// }

dbController.add_bytesinpersec_rate = async () => {
  const res = await fetch(`http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_bytesinpersec_rate[5m]`)
  const data = await res.json()
  
  let body = `
    INSERT INTO iris_database(key, identifier, metric, time, value)
    VALUES `;
  //key = identifier + metric + time 
  const results = data.data.result;
  console.log('Fetch results, ', results)
  
  results.forEach(result => {
    if (result.metric.topic) {
      const identifier = result.metric.topic;
      const metric = result.metric.__name__;
      for (let i = 0; i < result.values.length; i++) {
        const element = result.values[i]
        // result.values.forEach(element => {
        const time = element[0];
        const value = element[1];
        const key = `${identifier}%${metric}%${time}`;
        body += `('${key}', '${identifier}', '${metric}', ${time}, ${value}), `
      }
    }
  })

  body = body.slice(0,body.length-2)
  body+=';'
  
  console.log('dbQuery body: ', body)
  
  db.query(body, (err, result) => {
    if (err) {
      console.log(err, 'Caught add character error');
      return
    }
    console.log('finished Adding Data');
    return
  });
};

dbController.add_bytesinpersec_rate()


//copy = ${}

/*
starWarsController.addCharacter = (req, res, next) => {
  // write code here
  const nc = req.body;
  const sqlAddCharacter = `
  INSERT INTO people (name, gender,species_id, birth_year, 
    eye_color, skin_color, hair_color, mass, height, homeworld_id)
     VALUES ('${nc.name}', '${nc.gender}', '${nc.species_id}','${nc.birth_year}','${nc.eye_color}'
     ,'${nc.skin_color}','${nc.hair_color}','${nc.mass}','${nc.height}','${nc.homeworld_id}')  
  people_name = input('people name:')
  INSERT INTO people (name)
     VALUES (people_name)
  `;
  db.query(sqlAddCharacter);
  db.query('SELECT * FROM people ORDER BY people._id DESC LIMIT 1 ').then(
    (data) => {
      console.log('data:', data.rows);
    }
  );
 */

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