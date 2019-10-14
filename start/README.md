# Welcome

This code will be modified to follow along with the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

This guide will contain useful command line snippets and tidbits as I work through the tutorial circa Monday, October 14th, 2019.

## 1. Build a schema

```sh
# Set up Apollo Server
$ cd start/server && npm install

```

## 2. Hook up your data sources

Apollo makes connecting these services to your graph simple with our data source API. An Apollo data source is a class that encapsulates all of the data fetching logic, as well as caching and deduplication, for a particular service. By using Apollo data sources to hook up your services to your graph API, you're also following best practices for organizing your code.

```sh
# First, let's connect the Space-X v2 REST API to our graph
$ npm install apollo-datasource-rest --save

# To build a data source for a REST API, extend the RESTDataSource class and define this.baseURL
# The Apollo RESTDataSource also sets up an in-memory cache that caches responses from our REST resources with no additional setup using partial query caching

# Our REST API is read-only, so we need to connect our graph API to a database for saving and fetching user data.
# Navigate to start/server/src/datasources/user.js to see how our UserAPI data source has been created.
# Connect our REST API and SQL database to our server at start/server/src/index.js

```

## 3. Write your graph's resolvers

Take a look at `start/server/src/resolvers.js` for how we implemented our resolvers.

### GraphQL queries

Start your server with `npm start` and navigate to [http://localhost:4000/](http://localhost:4000/) to explore the sample GraphQL queries:

```sh
# Get our launches
query GetLaunches {
  launches {
    id
    mission {
      name
    }
  }
}

# Get launch details for a specific ID
query GetLaunchById {
  launch(id: 60) {
    id
    rocket {
      id
      type
    }
  }
}

# You can paste { "id": 60 } into the Query Variables section below before running your query.
query GetLaunchById($id: ID!) {
  launch(id: $id) {
    id
    rocket {
      id
      type
    }
  }
}
```