//Connect to AWS RDS PostgreSQL db
const { Pool } = require('pg');

// create a new pool here using the connection string above
const pool = new Pool({
  user: 'iris_admin',
  host: 'iris.cmfyktarcmqd.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    // console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};