const avro = require('avsc')

const eventInteger = avro.Type.forSchema(
  {
    type: 'record',
    fields: [
      {
        name: 'integer',
        type: 'int'
      }
    ]
  }
);

module.exports = eventInteger;

