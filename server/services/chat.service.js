const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");
const MessageModel = require("../models/Message.model");
const mongoose = require("mongoose");

module.exports = class ChatService {
  static async getAllChats() {
    try {
      const foundChats = await ChatModel.find();
      if (foundChats.length > 0)
        return foundChats.map(chatDocument => chatDocument.toObject());
      return null;
    } catch (ex) {
      throw ex;
    }
  }

  static async getChatById(chatId) {
    try {
      if (mongoose.isValidObjectId(chatId)) {
        const foundChat = await ChatModel.findById(chatId);
        if (foundChat) {
          return foundChat.toObject();
        }
        return null;
      } else {
        throw "Invalid Chat ID";
      }
    } catch (ex) {
      throw ex.message;
    }
  }

  static async createChat(data) {
    try {
      const chatDocument = new ChatModel(data);
      return await chatDocument.save();
      UserModel.find
    } catch (ex) {
      throw ex.message;
    }
  }


  /**
   * 
   * @param {{}} params 
   * @returns {Chat[]}
   */
  static async getChatsByParams(params) {
    try {
      let foundChats = await ChatModel
        .find(params)
        .populate([{
          path: "messages",
          select: "-chat",
          perDocumentLimit: 30
        }, {
          path: "participants.user",
          select: "_id name username"
        }])
        .sort([
          ["updatedAt", -1]
        ])
        .lean();
      if (foundChats) return foundChats;
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
   * @returns {Chat }
   */
  static async findChatByIdAndUpdate(id, data, method = null) {
    try {
      let updatedChat;
      if (method === "push")
        updatedChat = await ChatModel.findByIdAndUpdate(id, { $push: data }, { new: true }).lean();
      else if (method === "pull") {
        updatedChat = await ChatModel.findByIdAndUpdate(id, { $pull: data }, { new: true }).lean();
      }
      else
        updatedChat = await ChatModel.findByIdAndUpdate(id, data, { new: true }).lean();

      return updatedChat;

    } catch (ex) {
      throw ex;
    }
  }

  static isValidId(id) {
    return mongoose.isValidObjectId(id);
  }
}