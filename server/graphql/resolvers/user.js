const User = require('../../models/User');
const { verifyAdmin } = require('../../utils/authUtils');

const CLIENT_USER_TYPE = 'client';

const resolvers = {
  Query: {
    getUsers: async (_, { status, page = 1, limit = 10 }, context) => {
      const adminCheck = await verifyAdmin(context.token);
      if (!adminCheck.success) throw new Error(adminCheck.message);

      try {
        const filter = { userType: CLIENT_USER_TYPE };
        if (status) filter.status = status;

        const users = await User.find(filter)
          .skip((page - 1) * limit)
          .limit(limit);

        const totalUsers = await User.countDocuments(filter);

        return {
          success: true,
          message: "Users fetched successfully",
          users,
          totalUsers,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        return {
          success: false,
          message: "Error fetching users",
          users: [],
          totalUsers: 0,
        };
      }
    },

    getCurrentUser: async (_, __, { user }) => {
      if (!user) {
        return { success: false, message: "Unauthorized", user: null };
      }

      try {
        if (user.userType !== CLIENT_USER_TYPE) {
          return { success: false, message: "Unauthorized", user: null };
        }

        const currentUser = await User.findById(user.id);

        if (!currentUser) {
          return { success: false, message: "User not found", user: null };
        }

        return {
          success: true,
          message: "User fetched successfully",
          user: currentUser,
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        return { success: false, message: "Error fetching user", user: null };
      }
    },
  },

  Mutation: {
    updateUserStatus: async (_, { userId, status }, context) => {
      const adminCheck = await verifyAdmin(context.token);
      if (!adminCheck.success) throw new Error(adminCheck.message);

      try {
        const user = await User.findOne({ _id: userId, userType: CLIENT_USER_TYPE });
        if (!user) {
          return { success: false, message: "User not found or not a client" };
        }

        user.status = status;
        await user.save();

        return { success: true, message: "User status updated successfully" };
      } catch (error) {
        console.error("Error updating status:", error);
        return { success: false, message: "Error updating status" };
      }
    },
  },
};

module.exports = resolvers;
