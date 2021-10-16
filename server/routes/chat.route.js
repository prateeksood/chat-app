const router = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");
const MessageModel = require("../models/Message.model");
const ChatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/create", authMiddleware, ChatController.createChat);
router.get("/", authMiddleware, ChatController.getChatByCurrentUserId);
router.get("/:chatID/search", authMiddleware, ChatController.searchMessagesInChat);




module.exports = router;