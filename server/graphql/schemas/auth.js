const { gql } = require('apollo-server-express');

const authTypeDefs = gql`

 type ToolSettings {
      minimap: Boolean!
    wordWrap: String!
    tabSize: Int!
    theme: String!
    fontSize: Int!
    insertSpaces: Boolean!
    lineNumbers: String!
    cursorStyle: String!
    renderIndentGuides: Boolean!
}

type User {
  id: ID!
  name: String
  email: String!
  role: String!
  status: String!
  createdAt: String
  bookmarkedTools: [String]
  toolSettingsDefaults: ToolSettings
}

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

type CommonResponse {
    success: Boolean!
    message: String
  }

type Query {
  verifyToken(token: String!): CommonResponse!
}
  type Mutation {
    LoginSignup(email: String!): CommonResponse
    VerifyOtp(email: String!, otp: String!): AuthResponse
  }
`;

module.exports = authTypeDefs;
