// /** @typedef {import("./models.helper.ts").User} User */
const mongoose = require("mongoose");

// /** @type {mongoose.Schema<User, mongoose.Model<User,User,User,User>, User>} */
const UserSchema = new mongoose.Schema({
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
  }],
  requests: [{
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
  }],
  blocked: [{
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

module.exports = mongoose.model("User", UserSchema);