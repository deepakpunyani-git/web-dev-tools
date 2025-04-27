const User = require('../../models/User');
const { getVerifiedUser } = require('../../utils/authUtils');

const settingsResolvers = {
  Query: {
    getEditorSettings: async (_, __, context) => {
      const user = await getVerifiedUser(context.token);

      if (!user) {
        throw new Error('Unauthorized');
      }

      return user.toolSettingsDefaults || null;
    },
  },

  Mutation: {
    updateBookmarks: async (_, { bookmarkedTools }, context) => {
      const user = await getVerifiedUser(context.token);

      try {
        user.bookmarkedTools = bookmarkedTools;
        await user.save();

        return {
          success: true,
          message: 'Bookmarks updated successfully',
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: 'Error updating bookmarks',
        };
      }
    },

    updateEditorSettings: async (_, { toolSettingsDefaults }, context) => {
      try {
        const user = await getVerifiedUser(context.token);
        if (!user) {
          throw new Error("Unauthorized");
        }

        user.toolSettingsDefaults = {
          ...user.toolSettingsDefaults,
          ...toolSettingsDefaults,
        };

        await user.save();

        return {
          success: true,
          message: "Settings updated successfully",
        };
      } catch (error) {
        console.error("Error updating settings:", error);
        return {
          success: false,
          message: "Error updating settings",
        };
      }
    },
  },
};

module.exports = settingsResolvers;
