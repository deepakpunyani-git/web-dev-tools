const { gql } = require("apollo-server-express");

module.exports = gql`
  type ToolHistory {
    id: ID!
    userId: ID
    toolName: String!
    usedAt: String!
  }

  type ToolUsageStats {
    toolName: String!
    count: Int!
  }

  type DashboardStats {
    totalUsers: Int!
    totalBookmarks: Int!
    totalToolsUsed: Int!
    mostActiveUser: String!
  }

  type Query {
    getUserToolHistory: [ToolHistory!]!
    getToolUsageAnalytics: [ToolUsageStats!]!
    getDashboardStats: DashboardStats!
  }
`;
