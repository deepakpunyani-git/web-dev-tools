const mongoose = require('mongoose');

const toolHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  toolName: { type: String, required: true },
  usedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ToolHistory', toolHistorySchema);
