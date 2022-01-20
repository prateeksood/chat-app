/** @typedef {import("../models/models.helper.ts").Message} Message */


const mongoose = require("mongoose");
const MessageModel = require("../models/Message.model");


module.exports = class MessageService {

  /**
   * 
   * @param {string|mongoose.Types.ObjectId} id 
   * @returns {Message[]}
   */
  static async getMessageById(id) {
    try {
      let foundMessage = await MessageModel.findById(id).lean();
      return foundMessage;
    } catch (ex) {
      throw ex;
    }
  }

  /**
   * 
   * @param {string|mongoose.Types.ObjectId} chatId 
   * @param {Number} pageNumber 
   * @param {Number} pageSize
   */
  static async getMessagesByChatId(chatId, options) {
    const skips = Number(options.skips || 0);
    const pageSize = Number(options.pageSize || 100);
    try {
      const foundMessages = await MessageModel
        .find({ chat: chatId })
        .populate([
          {
            path: "sender",
            select: "_id username name"
          }, {
            path: "receivedBy.user",
            select: "_id username name "
          }, {
            path: "readBy.user",
            select: " _id username name "
          }, {
            path: "deletedBy.user",
            select: "_id username name}"
          }, {
            path: "reference",
            populate: [
              {
                path: "sender",
                select: "_id username name"
              }
            ]
          }
        ])
        .skip(skips)
        .limit(pageSize)
        .sort([['createdAt', -1]])
        .lean();
      return foundMessages;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {string} key 
   * @returns {Message []}
   */
  static async searchMessage(key, chatID = null) {
    try {
      let foundMessages = await MessageModel.find({ "content": new RegExp(key, "i"), "chat": chatID }).lean();
      return foundMessages;
    } catch (ex) {
      throw ex;
    }
  }
  /**
   * 
   * @param {{}} data
   */
  static async saveNewMessage(data) {
    try {
      const newMessage = new MessageModel(data);
      let savedMessage = await newMessage.save();
      if (savedMessage) {
        return (await savedMessage.populate([{
          path: "sender",
          select: "_id username name"
        }, {
          path: "receivedBy.user",
          select: "_id username name "
        }, {
          path: "readBy.user",
          select: " _id username name "
        }, {
          path: "deletedBy.user",
          select: "_id username name}"
        }, {
          path: "reference",
          populate: [
            {
              path: "sender",
              select: "_id username name"
            }
          ]
        }])).toObject();
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
  static async findMessageByIdAndUpdate(id, data, method = null) {
    try {
      let updatedMessage;
      if (method === "push")
        updatedMessage = await MessageModel.findByIdAndUpdate(id, { $push: data }, { new: true }).lean();
      else if (method === "pull") {
        updatedMessage = await MessageModel.findByIdAndUpdate(id, { $pull: data }, { new: true }).lean();
      } else if (method === "pop") {
        updatedMessage = await MessageModel.findByIdAndUpdate(id, { $pop: data }, { new: true }).lean();
      } else
        updatedMessage = await MessageModel.findByIdAndUpdate(id, data, { new: true }).lean();
      return updatedMessage;
    } catch (ex) {
      throw ex;
    }
  }
  static isValidId(id) {
    return mongoose.isValidObjectId(id);
  }
}