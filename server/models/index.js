const { DATABASE } = require('config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(DATABASE);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.dbModel = require('./db.model')(sequelize);

module.exports = db;
