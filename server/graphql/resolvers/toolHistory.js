const ToolHistory = require('../../models/ToolHistory');
const { verifyToken, verifyAdmin } = require('../../utils/authUtils');

const toolHistoryResolver = {
  Mutation: {
    async saveToolHistory(_, { toolName }, context) {
      let userId = null;
      const token = context.token;

      if (token) {
        const { success, decoded } = await verifyToken(token);
        if (success) userId = decoded.id;
      }

      await ToolHistory.create({ userId, toolName });
      return { success: true, message: "Tool usage saved" };
    },
  },

  Query: {
    async getUserToolHistory(_, __, context) {
      const token = context.token;
      const { success, decoded } = await verifyToken(token);
      if (!success) throw new Error("Unauthorized");

      return ToolHistory.find({ userId: decoded.id }).sort({ usedAt: -1 }).limit(20);
    },

    async getToolUsageAnalytics(_, __, context) {
      const adminCheck = await verifyAdmin(context.token);
      if (!adminCheck.success) throw new Error(adminCheck.message);

      return ToolHistory.aggregate([
        { $group: { _id: "$toolName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
    }
  }
};

module.exports = toolHistoryResolver;
