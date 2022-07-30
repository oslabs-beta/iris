import avro from 'avsc';

export default avro.Type.forSchema(
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

