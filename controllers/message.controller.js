const MessageService = require("../services/message.service");
const ChatService = require("../services/chat.service");
const UserService = require("../services/user.service");
// const connections = require("../socket")
module.exports = class MessageController {

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getMessagesByChatId(request, response, next) {
    try {
      const { pageSize, skips } = request.query;
      const { chatID } = request.params;
      if (!MessageService.isValidId(chatID)) {
        response.status(400).json({ message: "Invalid chat id" });
        return
      }

      const foundMessages = await MessageService.getMessagesByChatId(chatID, { pageSize, skips });
      response.status(200).json(foundMessages);
    } catch (ex) {
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async createNewMessage(request, response, next) {
    try {
      const {
        content,
        reference
      } = request.body;
      const { _id: sender } = request.user;
      const { chatID } = request.params;
      if (!MessageService.isValidId(chatID))
        throw "Invalid chat id";

      const savedMessage = await MessageService.saveNewMessage({ content, sender, reference, chat: chatID });
      if (!savedMessage)
        throw "Unable to save message";
      const chat = await ChatService.findChatByIdAndUpdate(chatID, { messages: savedMessage._id }, "push");
      await ChatService.findChatByIdAndUpdate(chatID, { lastMessageAt: new Date() });
      chat.participants.forEach(async (user) => {
        if (user.user.equals(sender) && !user.meta.hasAcceptedInvite) {
          await UserService.findUserByIdAndUpdate(sender, { contacts: chat.participants.filter(participant => !participant.user.equals(sender)) }, "push");
          await ChatService.findChatAndUpdate({ _id: chatID, "participants.user": sender }, { "participants.$.meta.hasAcceptedInvite": true });
        }
        if (user.user in global.connections && !user.user.equals(sender)) {
          global.connections[user.user].socket.send(JSON.stringify({
            error: null, type: "message", data: { message: savedMessage }
          }));
          await ChatService.findChatAndUpdate({ _id: chatID, "participants.user": user.user }, { "participants.$.meta.lastReceived": { message: savedMessage._id, time: new Date() } });
        }
      });
      response.status(200).json(savedMessage);
    } catch (ex) {
      console.log(ex);
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }
  }

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async deleteMessageByMessageId(request, response, next) {
    try {
      const { messageID } = request.params;
      const { _id: currentUser } = request.user;
      if (!MessageService.isValidId(messageID)) {
        response.status(400).json({ message: "Invalid chat id" });
        return
      }

      const updatedMessage = await MessageService.findMessageByIdAndUpdate(messageID, { deletedBy: { user: currentUser } }, "push");
      response.status(200).json(updatedMessage);
    } catch (ex) {
      response.status(500).json({ message: `Something went wrong: ${ex.message}` });
    }

  }
}