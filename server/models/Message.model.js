/** @typedef {import("./models.helper").Message} Message */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<Message, mongoose.Model<Message,Message,Message,Message>, Message>} */
const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  sentAt: {
    type: Date,
    required: true
  },
  receivedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }],
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }],
  deletedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model("Message", messageSchema);