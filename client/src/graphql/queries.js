import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($status: String, $page: Int, $limit: Int) {
    getUsers(status: $status, page: $page, limit: $limit) {
      success
      message
      totalUsers
      users {
        id
        email
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      success
      message
      user {
        id
        email
        status
        createdAt
        updatedAt
        hasUsedTrial
        planPurchaseDate
        planExpiryDate
        subscriptionPlan {
          id
          name
          price
          duration
        }
      }
    }
  }
`;



export const GET_EDITOR_SETTINGS = gql`
  query GetEditorSettings {
    getEditorSettings {
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
`;

export const GET_USER_TOOL_HISTORY = gql`
  query GetUserToolHistory {
    getUserToolHistory {
      id
      toolName
      usedAt
    }
  }
`;

export const GET_TOOL_USAGE_ANALYTICS = gql`
  query GetToolUsageAnalytics {
    getToolUsageAnalytics {
      toolName
      count
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalUsers
      totalBookmarks
      totalToolsUsed
      mostActiveUser
    }
  }
`;