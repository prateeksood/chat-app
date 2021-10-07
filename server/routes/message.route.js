const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth.middleware");
const User = require("../models/User.model");
const Chat = require("../models/Message.model");


router.post("/", authMiddleware, async (request, response) => {
  /** @type {mongoose.Document<any, any, User> & User & {_id: mongoose.Types.ObjectId}} */
  const {
    content,
    recipient,
    sender
  } = request.body;
  try {
    let foundChat = await Chat.findOne({
      "participants": new mongoose.Types.ObjectId(recipient),
      "participants": new mongoose.Types.ObjectId(sender)
    });
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`)
  }

  if (foundChat) {
    try {
      let updatedChat = await Chat.findByIdAndUpdate(foundChat._id, {
        $push: {
          messages: {
            sender: new mongoose.Types.ObjectId(sender),
            recipient: new mongoose.Types.ObjectId(recipient),
            content
          }
        }
      }, {
        new: true
      });
    } catch (err) {
      response.status(500).send(`Something went wrong : ${err.message}`)
    }
  } else {
    try {
      const newChat = new Chat({
        participants: [
          new mongoose.Types.ObjectId(recipient),
          new mongoose.Types.ObjectId(sender)
        ],
        messages: [{
          sender: new mongoose.Types.ObjectId(sender),
          recipient: new mongoose.Types.ObjectId(recipient),
          content
        }]

      });
      let savedChat = await newChat.save();
    } catch (err) {
      response.status(500).send(`Something went wrong : ${err.message}`)
    }

  }
  response.status(200).json({
    "message": "Message sent"
  });
});

module.exports = router;