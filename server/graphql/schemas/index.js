const authTypeDefs = require('./auth'); 
const userTypeDefs = require('./user');
const settingsTypeDefs = require('./settings');
const toolHistoryTypeDefs = require('./toolHistory');
const dashboardTypeDefs = require('./dashboard');

const typeDefs = [
  authTypeDefs,
  userTypeDefs,
  settingsTypeDefs,
  toolHistoryTypeDefs,
  dashboardTypeDefs
];

module.exports = typeDefs;
