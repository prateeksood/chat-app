/** @typedef {import("./models.helper").Chat} Chat */
const mongoose = require('mongoose');

/** @type {mongoose.Schema<Chat, mongoose.Model<Chat, Chat, Chat, Chat>, Chat>} */
const ChatSchema = new mongoose.Schema({
  participants: {
    type: [{
      userID: mongoose.Schema.Types.ObjectId,
      userName: String
    }, {
      userID: mongoose.Schema.Types.ObjectId,
      userName: String
    }],
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);