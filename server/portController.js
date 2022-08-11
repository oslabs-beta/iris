const Port = require('./portModel.js');
const bcrypt = require('bcryptjs');

const portController = {}

portController.verifyPort = async (req, res, next) => {
  try {
    const { port, password } = req.body;

    // checking if port or password is empty
    if (!port || !password) return next('port or password is missing')

    // parsing our Port db to see if we have a matching port
    const queryResult = await Port.findOne({ port: port });

    // checking to see if the password matches after to our bcrypt hash
    const comparePass = await bcrypt.compare(password, queryResult.password);

    // No results exist in db or password incorrect return error
    if (!queryResult || !comparePass) {
      console.log('invalid port or password');
      res.locals.port = null;
      return next({
        log: `error caught in portController.verifyPort`,
        status: 404,
        message: {error: 'an error occurred while attempting to verify a Port'}
      })
    } else {
      res.locals.port = port;
      return next();
    } 
  } 
  catch (err) {
    return next({
      log: `error caught in portController.verifyPort : ${err}`,
      status: 404,
      message: {err: 'an error occurred while attempting to verify a Port'}
    })
  }
};

// Create a port in backend via Postman
portController.createPort = async (req, res, next) => {
  try {
    const { port, password } = req.body;

    // checking if port or password is empty
    if (!port || !password) {
      return next({
        log: 'portController.createPort error',
        status: 404,
        message: {err: 'port or password missing in portContoller.createPort'}
      })
    }

    const results = await Port.findOne({port: port})

    if (results) {
      res.locals.port = null;
      return next();
    }

    // if port/password is not empty, we will create our port
    const queryResult = await Port.create({ port: port, password: password });

    // passing into our res so we can access
    res.locals.port = queryResult;
    return next();
  } 
  catch (err) {
    return next({
      log: `error caught in portController.createPort: ${err}`,
      status: 404,
      message: {err: 'an error occurred when attempting to create a port'}
    })
  }
};

module.exports = portController;
