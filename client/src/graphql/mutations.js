import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginSignup($email: String!) {
    LoginSignup(email: $email) {
      success
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($email: String!, $otp: String!) {
    VerifyOtp(email: $email, otp: $otp) {
      success
      token
      message
      user {
        id
        name
        email
        role
        bookmarkedTools
        toolSettingsDefaults {
             minimap
      wordWrap
      tabSize
      fontSize
      theme
      insertSpaces
      lineNumbers
      cursorStyle
      renderIndentGuides
        }
      }
    }
  }
`;


export const UPDATE_BOOKMARKS_MUTATION = gql`
  mutation UpdateBookmarks($bookmarkedTools: [String!]!) {
    updateBookmarks(bookmarkedTools: $bookmarkedTools) {
      success
      message
    }
  }
`;


export const SAVE_TOOL_HISTORY = gql`
  mutation SaveToolHistory($toolName: String!) {
    saveToolHistory(toolName: $toolName) {
      success
      message
    }
  }
`;



export const UPDATE_EDITOR_SETTINGS = gql`
  mutation UpdateEditorSettings($toolSettingsDefaults: ToolSettingsInput!) {
  updateEditorSettings(toolSettingsDefaults: $toolSettingsDefaults) {
    success
    message
  }
}

`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($userId: ID!, $status: String!) {
    updateUserStatus(userId: $userId, status: $status) {
      success
      message
    }
  }
`;