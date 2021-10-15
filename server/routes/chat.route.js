const router = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");
const MessageModel = require("../models/Message.model");
const ChatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, async (request, response) => {
  const {
    _id
  } = request.user
  try {

    let foundChats = await ChatModel.find({
      "participants.userID": _id
    });
    let updatedChats = [];
    for (let i = 0; i < foundChats.length; i++) {
      let foundMessages = await MessageModel.find({
        "chatID": new mongoose.Types.ObjectId(foundChats[i]._id)
      }).limit(20).sort([
        ['createdAt', -1]
      ]).exec();
      updatedChats.push({
        ...foundChats[i]._doc,
        previewMessages: foundMessages
      });
    }
    response.status(200).json(updatedChats);
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.post("/create", authMiddleware, ChatController.createChat);

router.get("/:chat_id/messages/lol", authMiddleware, async function(request, response){
  const {chat_id}=request.params;
  const {time,limit}=request.query;
  try{
    const foundChat=await ChatModel.findById(chat_id);
    if(foundChat){
      const respObj=foundChat.toObject();
      const participants={};
      const foundUsers=await UserModel.find({
        $or: respObj.participants.map(participant=>{
          participants[participant.userId]=participant;
          return {_id:participant.userId};
        })
      }).select({password:false,email:false});
      if(foundUsers.length>0){
        respObj.participants=foundUsers.filter(user=>{
          return user._id in participants;
        }).map(user=>{
          return {
            ...participants,
            name: user.name,
            username: user.username
          };
        });
      }else{
        respObj.participants=[];
      }
      const foundMessages=await MessageModel.find({
        chatId: chat_id
      }).limit(20);
      if(foundMessages){
        respObj.messages=foundMessage
      }else{
        respObj.messages=[];
      }
      response.status(200).json(respObj);
    }else
      response.status(500).send("Chat not found");
  }catch(ex){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/:chat_id/messages", authMiddleware, ChatController.getChatWithMessages);

router.get("/:chat_id/messages/search", authMiddleware, ChatController.searchMessagesInChat);

module.exports = router;