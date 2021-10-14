/** @typedef {import("../models/models.helper.ts").Message} Message */


const mongoose = require("mongoose");
const Message = require("../models/Message.model");


module.exports = class MessageService {

  /**
   * 
   * @param {string|mongoose.Types.ObjectId} id 
   * @returns {Message[]}
   */
  static async getMessageById(id) {
    try {
      let foundMessage = await Message.findById(id);
      if (foundMessage) return foundMessage.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param {string|mongoose.Types.ObjectId} chatId 
   * @param {Number} pageNumber 
   * @param {Number} pageSize 
   * @returns {Message[]}
   */
  static async getMessagesByChatId(chatId, pageSize = 20, skips = 0) {
    try {
      const foundMessages = await Message.find({ chatId }).skip(skips).limit(pageSize).sort([['createdAt', -1]]);
      return foundMessages;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param {{}} data 
   * @returns {Message}
   */
  static async saveNewMessage(data) {
    try {
      const newMessage = new Message(data);
      let savedMessage = newMessage.save();
      if (savedMessage) return savedMessage.toObject();
      return null;
    } catch (ex) {
      throw ex;
    }
  }
}