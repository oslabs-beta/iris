const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://iris_admin:password@iris.rbjzguc.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'IRIS'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log('Error connecting to MongoDB :', err));

const Schema = mongoose.Schema;

// Bcrypt library to help encrypt our password
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;

const user = Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  zipCode: {type: String}
})

// Prefunction that uses bcrypt to hash our password and resave
// into our database
user.pre('save', function(next){
  const user = this;  

  // bcrypt hash function here
  bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    return next();
  })
});

const User = mongoose.model('User', user);

module.exports = User;
