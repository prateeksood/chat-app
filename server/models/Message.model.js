/** @typedef {import("./models.helper").Chat} Chat */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<Chat, mongoose.Model<Chat,Chat,Chat,Chat>, Chat>} */
const chatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: Date.now()
    }
  }]
});


module.exports = mongoose.model("Chat", chatSchema);