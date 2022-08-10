const { ApolloServer, gql } = require('apollo-server');

const resolvers = {
  Query: {
    hello: (_, args) => {
      let value;
      if (args.name) {
        value = `Hello ${args.name}, nice to meet you!`
      } else {
        value = `Hello, nice to meet you!`
      }
      return { value }
    }
  }
}

const typeDefs = gql`
  type Hello {
    value: String
  }

  type Query {
    hello(name: String): Hello
  }
`

const server = new ApolloServer({
  resolvers,
  typeDefs
})

const reqBody = {
  query: "query BytesInPerSec ($arg1: String) { hello (name: $arg1) { value } }",
  operationName: "BytesInPerSec",
  variables: { "arg1": "Timothy" }
}

fetch("http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_bytesinpersec_rate[5m]", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(reqBody)
})

server.listen().then(({ port }) => {
  console.log(`Server started on port: ${port}`)
})