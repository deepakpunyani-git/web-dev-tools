const ToolHistory = require("../../models/ToolHistory");
const User = require("../../models/User");
const { getVerifiedUser, verifyAdmin } = require("../../utils/authUtils");

const dashboardResolver = {
  Query: {
    async getUserToolHistory(_, __, context) {
      const user = await getVerifiedUser(context.token);
      if (!user) {
        throw new Error("Unauthorized");
      }

      return ToolHistory.find({ userId: user._id }).sort({ usedAt: -1 }).limit(20);
    },

    async getToolUsageAnalytics(_, __, context) {
      const adminCheck = await verifyAdmin(context.token);
      if (!adminCheck.success) throw new Error(adminCheck.message);

      return ToolHistory.aggregate([
        { $group: { _id: "$toolName", count: { $sum: 1 } } },
        { $project: { toolName: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
    },

    async getDashboardStats(_, __, context) {
      const adminCheck = await verifyAdmin(context.token);
      if (!adminCheck.success) throw new Error(adminCheck.message);

      const totalUsers = await User.countDocuments();
      const totalBookmarks = await User.aggregate([
        { $unwind: "$bookmarkedTools" },
        { $count: "totalBookmarks" }
      ]);
      const totalToolsUsed = await ToolHistory.countDocuments();

      const activeUser = await ToolHistory.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        { $project: { email: "$user.email" } }
      ]);

      return {
        totalUsers,
        totalBookmarks: totalBookmarks[0]?.totalBookmarks || 0,
        totalToolsUsed,
        mostActiveUser: activeUser[0]?.email || "N/A",
      };
    }
  }
};

module.exports = dashboardResolver;
