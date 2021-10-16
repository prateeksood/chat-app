/** @typedef {import("./models.helper.ts").User} User */
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
    }
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
  }]
}, {
  timestamps: true
});

// userSchema.set("toObject", {
//   virtuals: true,
//   versionKey: false,
//   transform(doc, ret, options) {
//     delete ret._id;
//   }
// });

module.exports = mongoose.model("User", userSchema);