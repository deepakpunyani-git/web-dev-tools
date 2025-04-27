const authResolvers = require('./auth'); 
const userResolvers = require('./user');
const settingsResolvers = require('./settings');
const toolHistoryResolvers = require('./toolHistory');
const dashboardResolvers = require('./dashboard');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...toolHistoryResolvers.Query,
    ...settingsResolvers.Query,
    ...dashboardResolvers.Query

  },
  Mutation: {
    ...authResolvers.Mutation,  
    ...userResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...toolHistoryResolvers.Mutation,
     ...dashboardResolvers.Mutation
  }, 
};

module.exports = resolvers;
