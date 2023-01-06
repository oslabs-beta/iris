const mongoose = require('mongoose');

const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const SALT_FACTOR = 10;

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: process.env.DB_NAME,
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log('Error connecting to MongoDB :', err));

const port = Schema({
  port: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Prefunction that uses bcrypt to hash our password and resave
// into our database
port.pre('save', function (next) {
  const port = this;
  // bcrypt hash function here
  bcrypt.hash(port.password, SALT_FACTOR, (err, hash) => {
    if (err) return next(err);
    port.password = hash;
    return next();
  });
});

const Port = mongoose.model('port', port);

module.exports = Port;
