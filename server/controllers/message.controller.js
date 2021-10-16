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
      const { chatId, pageNumber = 1, pageSize = 20 } = request.body;
      if (!MessageService.isValidId(chatId))
        throw "Invalid chat id";
      const skips = pageSize * (pageNumber - 1);
      const foundMessages = await MessageService.getMessagesByChatId(chatId, pageNumber, skips);
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
        sender,
        reference
      } = request.body;
      const { chatId } = request.params;
      if (!reference)
        reference = null;
      if (!MessageService.isValidId(chatId))
        throw "Invalid chat id";
      await MessageService.saveNewMessage({ content, sender, reference, chat: chatId });
      response.status(200).json({ message: "Message sent successfully" });
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}