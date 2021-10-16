
const ChatService = require("../services/chat.service");
const MessageService = require("../services/message.service");
const UserService = require("../services/user.service");

module.exports = class ChatController {

  /**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */
  static async createChat(request, response) {
    const { participants, title } = request.body;
    const { _id: adminId } = request.user;
    try {
      if (participants && participants.length < 1) {
        response.status(400).json({ message: "Atleast two participant IDs are required" });
        return;
      }

      const foundUsers = await UserService.getUsersByIDs(participants, "in");
      console.log(foundUsers);
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
          groupAdmins: [adminId],
          participants: foundUsers.map(userDoc => {
            return {
              user: userDoc._id,
            };
          })
        }
      )
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