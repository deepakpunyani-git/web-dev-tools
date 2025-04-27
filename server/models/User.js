const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String},
  userType: { type: String, enum: ['admin', 'client'], default: 'client' },
  otp: { type: String },
  otpCreation: { type: Date },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  bookmarkedTools: [{ type: String }],
  toolSettingsDefaults: {
    minimap: { type: Boolean, default: true },
    wordWrap: { type: String, default: 'off' },
    tabSize: { type: Number, default: 2 },
    fontSize: { type: Number, default: 14 },
    insertSpaces: { type: Boolean, default: true },
    lineNumbers: { type: String, default: 'on' },
    cursorStyle: { type: String, default: 'line' },
    renderIndentGuides: { type: Boolean, default: true },
    theme: { type: String, default: 'vs-light' }
  }

});

module.exports = mongoose.model('User', userSchema);
