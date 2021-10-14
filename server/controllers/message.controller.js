const MessageService = require("../services/message.service");


module.exports = class MessageController {

  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  static async getMessagesByChatId(request, response, next) {
    try {
      const { chatId, pageNumber = 1, pageSize = 20 } = request.body;
      const skips = pageSize * (pageNumber - 1);
      const foundMessages = await MessageService.getMessagesByChatId(chatId, pageNumber, skips);
      response.status(200).json(foundMessages);
    } catch (ex) {
      response.status(500).json({ message: `Someting went wrong: ${ex.message}` });
    }
  }
}