const router = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");
const MessageModel = require("../models/Message.model");
const ChatController = require("../controllers/chat.controller");
const MessageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.get("/", authMiddleware, ChatController.getChatByCurrentUserId);
router.post("/create", authMiddleware, ChatController.createChat);
router.get("/:chatID/search", authMiddleware, ChatController.searchMessagesInChat);
router.get("/:chatID/messages", authMiddleware, MessageController.getMessagesByChatId);
router.post("/:chatID/send", authMiddleware, MessageController.createNewMessage);




module.exports = router;