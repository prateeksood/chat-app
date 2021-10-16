/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */
const ChatService = require("../services/chat.service");

module.exports = class ChatController {
  /** @type {<>(request:Request, response:Response, next:NextFunction)} */
  static async createChat(request, response) {
    const { participants, title } = request.body;
    if (participants) {
      ChatService.createChat(participants.split(","), title)
        .then(chatObject => response.status(200).json(chatObject))
        .catch(message => response.status(500).json({ message }));
    } else
      response.status(500).json({ message: "Participants IDs are missing" });
  }
  /** @type {<>(request:Request, response:Response, next:NextFunction)} */
  static async getChat(request, response) {
    const { chat_id } = request.params;
    ChatService.getChatById(chat_id, true)
      .then(chatObject => response.status(200).json(chatObject))
      .catch(message => response.status(500).json({ message }));
  }
  /** @type {<>(request:Request, response:Response, next:NextFunction)} */
  static async getChatWithMessages(request, response) {
    const { chat_id } = request.params;
    const { time } = request.query;
    ChatService.getMessagesByChatId(chat_id, time)
      .then(chatObject => response.status(200).json(chatObject))
      .catch(message => response.status(500).json({ message }));
  }
  static async getChatByUserId() {
    const { userId } = request.params;
    if (!ChatService.isValidId(userId))
      throw "Invalid user Id";
    const foundChats = await ChatService.getChatsByParams({ "participants.user": userId });
    response.status(200).json(foundChats);
  }
  static async searchMessagesInChat() { }
}