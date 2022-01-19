/** @typedef {import("./models.helper").Chat} Chat */
const mongoose = require('mongoose');

/** @type {mongoose.Schema<Chat, mongoose.Model<Chat, Chat, Chat, Chat>, Chat>} */
const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  groupAdmins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    since: {
      type: Date,
      default: Date.now,
      required: true
    },
    meta: {
      lastRead: {
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message"
        },
        time: {
          type: Date,
          default: Date.now,
          required: true
        }
      },
      lastReceived: {
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message"
        },
        time: {
          type: Date,
          default: Date.now,
          required: true
        }
      },
      hasAcceptedInvite: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    _id: false
  }],
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message"
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Chat', chatSchema);