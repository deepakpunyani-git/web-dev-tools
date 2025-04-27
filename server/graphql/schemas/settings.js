const { gql } = require('apollo-server-express');

const settingsTypeDefs = gql`
  type ToolSettings {
    minimap: Boolean
    wordWrap: String
    tabSize: Int
    theme: String
    fontSize: Int
    insertSpaces: Boolean
    lineNumbers: String
    cursorStyle: String
    renderIndentGuides: Boolean
  }

  input ToolSettingsInput {
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

  type CommonResponse {
    success: Boolean!
    message: String
  }

  type Query {
    getEditorSettings: ToolSettings
  }

  type Mutation {
    updateBookmarks(bookmarkedTools: [String!]!): CommonResponse
    updateEditorSettings(toolSettingsDefaults: ToolSettingsInput!): CommonResponse
  }
`;

module.exports = settingsTypeDefs;
