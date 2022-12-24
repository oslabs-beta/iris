module.exports = {
  BASE_PATH: 'http://localhost:9090',
  PROM_QUERY: '/api/v1/query?query=',
  DB_TABLE: 'iris_database',
  DATABASE: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_TABLE,
    password: process.env.DB_PASSWORD,
    port: 5432,
  }
}