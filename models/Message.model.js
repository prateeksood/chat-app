/** @typedef {import("./models.helper").Message} Message */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<Message, mongoose.Model<Message,Message,Message,Message>, Message>} */
const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },
  receivedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: Date,
      default: Date.now,
      required: true
    },
    _id: false
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: Date,
      default: Date.now,
      required: true
    },
    _id: false
  }],
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: Date,
      default: Date.now,
      required: true
    },
    _id: false
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);