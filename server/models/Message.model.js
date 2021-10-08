/** @typedef {import("./models.helper").Message} Message */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<Message, mongoose.Model<Message,Message,Message,Message>, Message>} */
const messageSchema = new mongoose.Schema({
  chatID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Chat"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model("Message", messageSchema);