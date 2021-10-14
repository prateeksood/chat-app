// /** @typedef {import("./models.helper.ts").Message} Message */
const mongoose = require("mongoose");

// /** @type {mongoose.Schema<Message, mongoose.Model<Message,Message,Message,Message>, Message>} */
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
    ref: "Message",
    default: null
  },
  sentAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  receivedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time: {
      type: Date,
      default: Date.now,
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
      type: Date,
      default: Date.now,
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
      type: Date,
      default: Date.now,
      required: true
    }
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model("Message", messageSchema);