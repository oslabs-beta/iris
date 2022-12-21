//Connect to AWS RDS PostgreSQL db
import { Pool } from 'pg';

// create a new pool here using the connection string above
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_TABLE,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

