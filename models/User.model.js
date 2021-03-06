/** @typedef {import("./models.helper").User} User */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<User, mongoose.Model<User,User,User,User>, User>} */
const userSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  contacts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: Date,
      default: Date.now,
      required: true
    },
    _id: false
  }],
  sentRequests: [{
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
  recievedRequests: [{
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
  blocked: [{
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
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  }]
}, {
  timestamps: true
});
userSchema.post('validate', doc => {
  doc.username = sanitize(doc.username);
  doc.email = sanitize(doc.email);
  doc.password = sanitize(doc.password);
  doc.name = sanitize(doc.name);
});

module.exports = mongoose.model("User", userSchema);