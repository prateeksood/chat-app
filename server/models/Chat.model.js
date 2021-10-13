/** @typedef {import("./models.helper").Chat} Chat */
const mongoose = require('mongoose');

/** @type {mongoose.Schema<Chat, mongoose.Model<Chat, Chat, Chat, Chat>, Chat>} */
const ChatSchema = new mongoose.Schema({
  title: {
    type: "string",
    default: ""
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);