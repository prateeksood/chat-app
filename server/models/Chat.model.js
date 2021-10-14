// /** @typedef {import("./models.helper.temp").Chat} Chat */
const mongoose = require('mongoose');

// /** @type {mongoose.Schema<Chat, mongoose.Model<Chat, Chat, Chat, Chat>, Chat>} */
const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: Date,
      default: Date.now,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);