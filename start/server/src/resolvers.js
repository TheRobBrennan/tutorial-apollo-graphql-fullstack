const { paginateResults } = require('./utils');

/**
 * REMEMBER: Resolver functions accept the following arguments:
 *
 * fieldName: (parent, args, context, info) => data;
 *  parent: An object that contains the result returned from the resolver on the parent type
 *  args: An object that contains the arguments passed to the field
 *  context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 *  info: Information about the execution state of the operation which should only be used in advanced cases
 */
module.exports = {
  /**
   * Resolvers for Query fields identified in start/server/src/schema.js
   *
   * The first argument to our top-level resolvers, parent, is always blank because it refers to the root of our graph.
   * The second argument refers to any arguments passed into our query, which we use in our launch query to fetch a launch by its id.
   * Finally, we destructure our data sources from the third argument, context, in order to call them in our resolvers.
   *
   * Our resolvers are simple and concise because the logic is embedded in the LaunchAPI and UserAPI data sources. We recommend keeping your resolvers thin as a best practice, which allows you to safely refactor without worrying about breaking your API.
   */
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },

    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },
};
