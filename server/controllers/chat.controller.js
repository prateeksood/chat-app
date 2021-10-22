/**
  * @typedef {import("express").Request} Request
  * @member {string} Request.body
  * @typedef {import("express").Response} Response
  * @typedef {import("express").NextFunction} NextFunction
  */

const ChatService = require("../services/chat.service");
const MessageService = require("../services/message.service");
const UserService = require("../services/user.service");

module.exports = class ChatController {

  /**
   * @param {Request} request
   * @param {Response} response
   */
  static async createChat(request, response) {
    const { title } = request.body;
    const { _id: adminId } = request.user;
    if(!request.body.participants){
      response.status(400).json({message:"Participants required"});
      return;
    }
    try {
      /** @type {string[]} */
      const participants=request.body.participants.split(",");
      if(!participants.includes(adminId))
        participants.push(adminId);
      if (participants && participants.length < 1) {
        response.status(400).json({ message: "Atleast two participant IDs are required" });
        return;
      }

      const foundUsers = await UserService.getUsersByIDs(participants, "in");
      if (participants.length !== foundUsers.length) {
        response.status(400).json({ message: "There were invalid user IDs present in your request" });
        return;
      }
      if (participants.length > 2 && !title) {
        response.status(400).json({ message: "No group title provided for group chat" });
        return;
      }
      let newChat = await ChatService.createChat(
        {
          title,
          isGroupChat: participants.length > 2,
          groupAdmins: participants.length > 2 ? [adminId] : participants,
          participants: foundUsers.map(userDoc => {
            return {
              user: userDoc._id,
            };
          })
        }
      );
      for(let user of foundUsers){
        if(participants.length===2 && user._id===adminId)
          user.contacts.push(participants[0]);
        user.chats.push(newChat._id);
        await user.save();
      }
      response.status(200).json(newChat);
    }
    catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getChatByCurrentUserId(request, response, next) {
    try {

      const { _id: currentUserId } = request.user;
      const foundChats = await ChatService.getChatsByParams({ "participants.user": currentUserId });
      response.status(200).json(foundChats);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async searchMessagesInChat(request, response, next) {
    try {

      const { key } = request.query;
      const { chatID } = request.params;
      const foundMessages = await MessageService.searchMessage(key, chatID);
      response.status(200).json(foundMessages);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}