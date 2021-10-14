/** @typedef {import("../models/models.helper.ts").User} User */
const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports = class UserService {

  static async getAllUsers() {
    try {
      let allUsers = await User.find().select({ password: false });
      if (allUsers) return allUsers.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string} key 
   * @returns {User []}
   */
  static async searchUser(key) {
    try {
      let foundUsers = await User.find({
        $or: [{
          "username": new RegExp(key, "i")
        },
        {
          "name": new RegExp(key, "i")
        },
        {
          "email": new RegExp(key, "i")
        }
        ]
      }).select({ password: false });;
      if (foundUsers) return foundUsers.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string|mongoose.Types.ObjectId} id 
   * @returns {User }
   */
  static async getUserByID(id) {
    try {
      let foundUser = await User.findById(id).select({ password: false });;
      if (foundUser) return foundUser.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{}} params 
   * @returns {User []}
   */
  static async getUsersByParams(params) {
    try {
      let foundUsers = await User.find(params).select({ password: false });;
      if (foundUsers) return foundUsers.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{}} params 
   * @returns {User }
   */
  static async getSingleUserByParams(params) {
    try {
      let foundUser = await User.findOne(params).select({ password: false });;
      if (foundUser) return foundUser.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{username:string,email:string,password:string,image?:string}} data 
   * @returns {User}
   */
  static async saveNewUser(data) {
    try {
      const newUser = new User(data);
      let savedUser = await newUser.save();
      if (savedUser) {
        savedUser = savedUser.toObject();
        delete savedUser.password;
        return savedUser;
      }
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string|mongoose.Types.ObjectId} id 
   * @param {{}} data 
   * @returns {User }
   */
  static async findUserByIdAndUpdate(id, data) {
    try {
      let updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      if (updatedUser) {
        updatedUser = updatedUser.toObject();
        delete updatedUser.password;
        return updatedUser;
      }
    } catch (ex) {
      throw ex;
    }
  }
}