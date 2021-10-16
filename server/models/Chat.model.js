/** @typedef {import("./models.helper").Chat} Chat */
const mongoose = require('mongoose');

/** @type {mongoose.Schema<Chat, mongoose.Model<Chat, Chat, Chat, Chat>, Chat>} */
const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  groupAdmins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: Date,
      default: Date.now,
      required: true
    }
  }],
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message"
  }
}, {
  timestamps: true
});

chatSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret, options) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Chat', chatSchema);