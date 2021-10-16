const MessageService = require("../services/message.service");
const ChatService = require("../services/chat.service");
module.exports = class MessageController {

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getMessagesByChatId(request, response, next) {
    try {
      const { pageNumber = 1, pageSize = 30 } = request.body;
      const { chatID } = request.params;
      if (!MessageService.isValidId(chatID)) {
        response.status(400).json({ message: "Invalid chat id" });
        return
      }
      const skips = pageSize * (pageNumber - 1);
      const foundMessages = await MessageService.getMessagesByChatId(chatID, pageSize, skips);
      response.status(200).json(foundMessages);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
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
      await ChatService.findChatByIdAndUpdate(chatID, { messages: savedMessage._id }, "push");

      response.status(200).json({ message: "Message sent successfully" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}