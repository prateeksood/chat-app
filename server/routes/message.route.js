const router=require("express").Router();
const mongoose=require("mongoose");
const authMiddleware=require("../middlewares/auth.middleware");
const User=require("../models/User.model");
const Chat=require("../models/Message.model");

router.post("/",authMiddleware,async (request,response) => {
  /** @type {mongoose.Document<any, any, User> & User & {_id: mongoose.Types.ObjectId}} */
  const sender=request.user;
  if(sender){
    const {content, chatId} = request.body;
    try{
      const chat=await Chat.findById(chatId);
      if(!chat)
        response.status(401).send("Chat does not exist");
      else if(!chat.participants.includes(sender._id))
        response.status(401).send("You are not authorised")
      else{
        const message={sender,content};
        chat.messages.push(message);
        chat.save().then(()=>{
          response.status(200).json(message);
        }).catch(ex=>{
          response.status(500).send("Something went wrong while sending the message: "+ex);
        });
      }
    }catch(error){
      response.status(500).send(`Something went wrong : ${error.message}`);
    }
  }else{
    response.status(401).send("Invalid Token, Access Denied");
  }
})

module.exports=router;