const { BASE_PATH } = require('./default') 

module.exports = {
  BASE_PATH: BASE_PATH,
  DB_TABLE: 'dev_table',
  DATABASE: {
    host: 'localhost',
    user: 'dev_user',
    password: 'dev_pw',
    port: 8532,
  }
}