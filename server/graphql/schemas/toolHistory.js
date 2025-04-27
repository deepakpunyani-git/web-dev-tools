const { gql } = require('apollo-server-express');

const ToolHistoryTypeDefs = gql`
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

type SaveToolHistoryResponse {
  success: Boolean!
  message: String!
}

type Query {
  getUserToolHistory: [ToolHistory!]!

  getToolUsageAnalytics: [ToolUsageStats!]!
}

type Mutation {
  # Save a usage entry (userId is optional, pulled from token)
  saveToolHistory(toolName: String!): SaveToolHistoryResponse!
}

  
`;

module.exports = ToolHistoryTypeDefs;
