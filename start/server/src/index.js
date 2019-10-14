const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// Set up our database
const store = createStore();

const server = new ApolloServer({
  // Our GraphQL schema
  typeDefs,

  // Apollo Server will automatically add the launchAPI and userAPI to our resolvers' context so we can easily call them.
  resolvers,

  // Add instantiated data sources to the dataSources property for our server
  dataSources: () => ({
    // Use the Space-X REST API
    launchAPI: new LaunchAPI(),

    /*
      Pass in our database to the UserAPI data source

      IMPORTANT: If you use this.context in your datasource, it's critical to create a new instance in the dataSources function and to not share a single instance. Otherwise, initialize may be called during the execution of asynchronous code for a specific user, and replace the  this.context by the context of another user.
    */
    userAPI: new UserAPI({ store })

  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});