//Connect to AWS RDS PostgreSQL db
import { Pool } from 'pg';

import config from 'config'
const DATABASE = config.get('DATABASE')

// create a new pool here using the connection string above
const pool = new Pool(DATABASE)

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

