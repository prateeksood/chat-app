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
    if (!request.body.participants) {
      response.status(400).json({ message: "Participants required" });
      return;
    }
    try {
      /** @type {string[]} */
      let participants = [];
      request.body.participants.forEach(user => {
        participants.push(user._id);
      })
      if (!participants.includes(adminId))
        participants.push(adminId);
      participants = participants.filter(participant => participants.indexOf(participant) === participants.lastIndexOf(participant));
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
      for (let user of foundUsers) {
        if (participants.length === 2 && user._id.equals(adminId))
          user.contacts.push({ user: participants[0] });
        user.chats.push(newChat._id);
        await user.save();
      }
      response.status(200).json(newChat);
      // console.log(newChat)
    }
    catch (ex) {
      console.log(ex)
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }
  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getChatByCurrentUserId(request, response, next) {
    try {
      const { pageSize, skips } = request.query;
      const { _id: currentUserId } = request.user;
      const foundChats = await ChatService.getChatsByParams({ "participants.user": currentUserId }, { pageSize, skips });
      foundChats.forEach(async chat => {
        const lastMessageId = chat.messages[0];
        await ChatService.findChatAndUpdate({ _id: chat._id, "participants.user": currentUserId }, { "participants.$.meta.lastReceived": { message: lastMessageId, time: new Date() } });
      })
      response.status(200).json(foundChats);
    } catch (ex) {
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
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
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }
  static async updateLastRead(request, response, next) {
    try {

      const { _id: currentUserId } = request.user;
      const { message } = request.query;
      const { chatID } = request.params;
      let lastMessageId = message;
      if (!lastMessageId) {
        const chat = await ChatService.getChatById(chatID);
        lastMessageId = chat.messages[0]._id;
      }
      await ChatService.findChatAndUpdate({ _id: chatID, "participants.user": currentUserId }, { "participants.$.meta.lastRead": { message: lastMessageId, time: new Date() } });
      response.status(200).json({ message: `Last read message updated to : ${lastMessageId}` });
    } catch (ex) {
      console.log(ex);
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }
}