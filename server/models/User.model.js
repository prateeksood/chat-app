/// <reference path="models.helper.ts"/>

const mongoose = require("mongoose");

/** @type {mongoose.Schema<User, mongoose.Model<User,User,User,User>, User>} */
const UserSchema = new mongoose.Schema({
  name: {
    required: true,
    type: "String",
  },
  email: {
    required: true,
    type: "String",
  },
  username: {
    required: true,
    type: "String",
    unique: true
  },
  password: {
    required: true,
    type: "String",
  },
});

module.exports = mongoose.model("User", UserSchema);