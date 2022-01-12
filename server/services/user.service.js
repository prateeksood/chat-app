/** @typedef {import("../models/models.helper").User} User */
const UserModel = require("../models/User.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = class UserService {

  static async fetchAllUsers() {
    try {
      let allUsers = await UserModel.find().select({ password: false }).lean();
      return allUsers
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string} key
   */
  static async searchUsers(key) {
    try {
      let foundUsers = await UserModel.find({
        $or: [
          { username: key },
          { name: new RegExp(key, "i") },
          { email: key }
        ]
      }).select({ password: false }).lean();
      console.log(foundUsers);
      return foundUsers;
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
      const foundUser = await UserModel.findById(userId).lean();
      const index = await foundUser[arrayName].map(item => item[key].toString()).indexOf(value);
      return index;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string|mongoose.Types.ObjectId} id
   */
  static async getUserByID(id) {
    try {
      let foundUser = await UserModel.findById(id).select({ password: false }).populate([{
        path: "contacts.user",
        select: "_id name username lastSeen"
      }]).lean();
      return foundUser;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param {string [] |mongoose.Types.ObjectId []} id 
   */
  static async getUsersByIDs(id, method = null) {
    try {
      let foundUsers;
      if (method === "in")
        foundUsers = await UserModel.find({ _id: { "$in": id } }).select({ password: false });
      return foundUsers;
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
      let foundUsers = await UserModel.find(params).select({ password: false }).lean();
      return foundUsers;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{}} params
   * @param {Boolean} returnPassword
   * @returns {UserModel }
   */
  static async getSingleUserByParams(params, returnPassword = false) {
    try {
      let foundUser;
      if (!returnPassword)
        foundUser = await UserModel.findOne(params).select({ password: false }).lean();
      else
        foundUser = await UserModel.findOne(params).lean();
      return foundUser;
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
        updatedUser = await UserModel.findByIdAndUpdate(id, { $push: data }, { new: true }).lean();
      else if (method === "pull") {
        updatedUser = await UserModel.findByIdAndUpdate(id, { $pull: data }, { new: true }).lean();
      } else if (method === "pop") {
        updatedUser = await UserModel.findByIdAndUpdate(id, { $pop: data }, { new: true }).lean();
      } else
        updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updatedUser) {
        delete updatedUser.password;
      }
      return updatedUser;
    } catch (ex) {
      throw ex;
    }
  }
  static isValidId(id) {
    return id && mongoose.isValidObjectId(id);
  }
  static getLoggedInUser(cookies) {
    const token = cookies.split(";").filter(cookieStr => {
      return cookieStr.search("token=") >= 0;
    }).map(cookieStr => {
      return cookieStr.split("=")[1].trim();
    })[0];
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (ex) {
      return null;
    }
  }
}