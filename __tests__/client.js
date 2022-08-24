const fs = require('fs');
const path = require('path');
const client = require('../client/home/containers')

describe('client unit tests', () => {
  beforeAll((done) => {
    fs.writeFile(clientTestFile, JSON.stringify([]), () => {
      client.reset();
      done();
    }); 
  }); 


  })









})