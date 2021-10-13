const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
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
      let foundMessages = await Message.find({
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

router.post("/create", authMiddleware, async function(request, response){
});

router.get("/:chat_id", authMiddleware, async function(request, response){
  const {chat_id}=request.params;
  try{
    const foundChat=await Chat.findById(chat_id);
    if(foundChat){
      const respObj=foundChat.toObject();
      const participants={};
      const foundUsers=await User.find({
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
        response.status(200).json(respObj);
      }else{
        respObj.participants=[];
        response.status(200).json(respObj);
      }
    }else
      response.status(500).send("Chat not found");
  }catch(ex){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/:chat_id/messages", authMiddleware, async function(request, response){
  const {chat_id}=request.params;
  const {time,limit}=request.query;
  try{
    const foundChat=await Chat.findById(chat_id);
    if(foundChat){
      const respObj=foundChat.toObject();
      const participants={};
      const foundUsers=await User.find({
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
      const foundMessages=await Message.find({
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

router.get("/:chat_id/messages/send", authMiddleware, async function(request, response){
});

router.get("/:chat_id/messages/search", authMiddleware, async function(request, response){
});

module.exports = router;