const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth.middleware");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");



router.get("/:chatID", authMiddleware, async (request, response) => {
  const {
    chatID
  } = request.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(chatID))
      return response.status(400).send("Invalid chat ID");
    const foundMessages = await Message.find({
      "chatID": new mongoose.Types.ObjectId(chatID)
    });
    response.status(200).send(foundMessages);
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }


})

router.post("/", authMiddleware, async (request, response) => {
  const {
    content,
    recipient,
    sender
  } = request.body;
  try {
    let foundChat = await Chat.findOne({
      "participants.userID": new mongoose.Types.ObjectId(recipient._id),
      "participants.userID": new mongoose.Types.ObjectId(sender._id)
    });
    if (!foundChat) {
      newChat = new Chat({
        participants: [{
          userID: new mongoose.Types.ObjectId(recipient._id),
          userName: recipient.username
        }, {
          userID: new mongoose.Types.ObjectId(sender._id),
          userName: sender.username
        }]
      });
      console.log(newChat);
      let savedChat = await newChat.save();
      foundChat = savedChat;
    }
    newMessage = new Message({
      chatID: foundChat._id,
      sender: new mongoose.Types.ObjectId(sender._id),
      recipient: new mongoose.Types.ObjectId(recipient._id),
      content
    });
    await newMessage.save();
    response.status(200).json({
      "message": "Mesage sent"
    });
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

module.exports = router;