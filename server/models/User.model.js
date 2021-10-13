/** @typedef {import("./models.helper").User} User */
const mongoose = require("mongoose");

/** @type {mongoose.Schema<User, mongoose.Model<User,User,User,User>, User>} */
const UserSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
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
    type: String
  },
  contacts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }],
  requests: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    since: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  }],
  blocked: [{
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

module.exports = mongoose.model("User", UserSchema);