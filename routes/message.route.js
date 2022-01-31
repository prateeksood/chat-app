const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth.middleware");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const MessageController = require("../controllers/message.controller");

router.get("/:chatID", authMiddleware, MessageController.getMessagesByChatId);
router.post("/:chatID", authMiddleware, MessageController.createNewMessage);
router.get("/:messageID/delete", authMiddleware, MessageController.deleteMessageByMessageId);

module.exports = router;