/** @typedef {import("../models/models.helper").User} User */
const UserModel = require("../models/User.model");
const mongoose = require("mongoose");

module.exports = class UserService {

  static async getAllUsers() {
    try {
      let allUsers = await User.find().select({ password: false }).lean();
      if (allUsers) return allUsers
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
  static async searchUsers(key) {
    try {
      let foundUsers = await UserModel.find({
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
      }).select({ password: false }).lean();
      console.log(foundUsers)
      if (foundUsers) return foundUsers;
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * @param {string|mongoose.Types.ObjectId} userId _id of user
   * @param {string} arrayName Name of array in which we want to search
   * @param {string} key Key of object in the array we are using to search
   * @param {string} value Value for the key (value to search)
   * @returns {Number} 
   */
  static async searchInArray(userId, arrayName, key, value) {
    try {
      const foundUser = await User.findById(userId).lean();
      const index = await foundUser[arrayName].map(item => item[key].toString()).indexOf(value);
      return index;
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
      let foundUser = await User.findById(id).select({ password: false }).lean();
      if (foundUser) return foundUser;
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
      let foundUsers = await User.find(params).select({ password: false }).lean();;
      if (foundUsers) return foundUsers;
      return null;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{}} params
   * @param {Boolean} returnPassword
   * @returns {User }
   */
  static async getSingleUserByParams(params, returnPassword = false) {
    try {
      let foundUser;
      console.log(returnPassword)
      if (!returnPassword)
        foundUser = await User.findOne(params).select({ password: false }).lean();
      else
        foundUser = await User.findOne(params).lean();
      if (foundUser) return foundUser;
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
      const newUser = new UserModel(data);
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
   * @param {"push"|"pull"|none} method
   * @returns {User }
   */
  static async findUserByIdAndUpdate(id, data, method = null) {
    try {
      let updatedUser;
      if (method === "push")
        updatedUser = await User.findByIdAndUpdate(id, { $push: data }, { new: true }).lean();
      else if (method === "pull") {
        updatedUser = await User.findByIdAndUpdate(id, { $pull: data }, { new: true }).lean();
      }
      else
        updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updatedUser) {
        delete updatedUser.password;
        return updatedUser;
      }
      return null;
    } catch (ex) {
      throw ex;
    }
  }
}