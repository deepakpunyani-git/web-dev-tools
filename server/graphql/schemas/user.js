const { gql } = require('apollo-server-express');

const userSchema = gql`
  type User {
    id: ID!
    email: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type UserListResponse {
    success: Boolean!
    message: String!
    users: [User]
    totalUsers: Int
  }

  type UserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type UpdateResponse {
    success: Boolean!
    message: String
  }

  type Query {
    getUsers(status: String, page: Int, limit: Int): UserListResponse
    getCurrentUser: UserResponse!
  }

  type Mutation {
    updateUserStatus(userId: ID!, status: String!): UpdateResponse
  }
`;

module.exports = userSchema;
