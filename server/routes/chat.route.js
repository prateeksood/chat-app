const router = require("express").Router();
const mongoose = require("mongoose");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, async (request, response) => {
  const {
    _id
  } = request.user
  try {

    let foundChats = await Chat.find({
      "participants.userID": _id
    });
    let updatedChats = [];
    for (let i = 0; i < foundChats.length; i++) {
      let foundMessages = await Message.find().limit(20).sort([
        ['createdAt', -1]
      ]).exec({
        "chatID": new mongoose.Types.ObjectId(foundChats[i]._id)
      });
      updatedChats.push({
        ...foundChats[i]._doc,
        previewMessages: foundMessages
      });
    }
    response.status(200).json(updatedChats);
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
})

module.exports = router;