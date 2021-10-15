const UserModel = require("../models/User.model");
const ChatModel = require("../models/Chat.model");
const MessageModel = require("../models/Message.model");
const mongoose = require("mongoose");

module.exports=class ChatService{
  static async getAllChats(){
    try{
      const foundChats=await ChatModel.find();
      if(foundChats.length>0)
        return foundChats.map(chatDocument=>chatDocument.toObject());
      return null;
    }catch(ex){
      throw ex;
    }
  }
  static async getChatById(chatId){
    try{
      if(mongoose.isValidObjectId(chatId)){
        const foundChat=await ChatModel.findById(chatId);
        if(foundChat){
          return foundChat.toObject();
        }
        return null;
      }else{
        throw "Invalid Chat ID";
      }
    }catch(ex){
      throw ex.message;
    }
  }
  static async getMessagesByChatId(chatId,timeAfter=0){
    try{
      if(mongoose.isValidObjectId(chatId)){
        const query=MessageModel.find({
          chatId,
          // sentAt:{
          //   $gt:new Date(timeAfter)
          // }
        }).sort({sentAt:"desc"})
        .populate([
          {
            path:"chat",
            populate:{
              path:"participants.user",
              select:{_id:true,username:true,name:true}
            }
          },{
            path:"sender",
            select:{_id:true,username:true,name:true,id:true}
          },{
            path:"receivedBy.user",
            select:{_id:true,username:true,name:true}
          },{
            path:"readBy.user",
            select:{_id:true,username:true,name:true}
          },{
            path:"deletedBy.user",
            select:{_id:true,username:true,name:true}
          }
        ]);
        const foundMessages=await query;
        if(foundMessages.length>0){
          return foundMessages.map(messageDoc=>messageDoc.toObject());
        }
        return null;
      }else{
        throw "Invalid Chat ID";
      }
    }catch(ex){
      throw ex.message;
    }
  }
  static async getMessagesByChatIds(chatIds=[],timeAfter=0){
    try{
      if(chatIds.every(id=>mongoose.isValidObjectId(id))){
        const query=MessageModel.find({
          $or:chatIds.map(chatId=>{
            return {chatId};
          }),
          $where:"sentAt>"+timeAfter
        }).sort({sentAt:"desc"})
        .populate([
          {
            path:"chat",
            populate:{
              path:"participants.user",
              select:{_id:true,username:true,name:true}
            }
          },{
            path:"receivedBy.user",
            select:{_id:true,username:true,name:true}
          },{
            path:"readBy.user",
            select:{_id:true,username:true,name:true}
          },{
            path:"deletedBy.user",
            select:{_id:true,username:true,name:true}
          }
        ]);
        const foundMessages=await query;
        if(foundMessages.length>0){
          return foundMessages.map(messageDoc=>messageDoc.toObject());
        }
        return [];
      }else{
        throw "Invalid Chat ID";
      }
    }catch(ex){
      throw ex.message;
    }
  }
  static async createChat(participantsId=[],title=null){
    try{
      const foundUsers=await UserModel.find({
        $or:participantsId.map(userId=>{
          return {_id:userId}
        })
      }).select({_id:true});
      if(participantsId.length!==foundUsers.length)
        throw "There were invalid user IDs present in your request";
      if(foundUsers.length>1){
        const since=Date.now();
        const chatDocument=new ChatModel({
          title,
          participants:foundUsers.map(userDoc=>{
            return {
              user:userDoc._id,
              since
            };
          })
        });
        return await chatDocument.save();
      }
      throw "A chat with less than 2 participants can not be created";
    }catch(ex){
      throw ex.message;
    }
  }
  /**
   * @returns {Promise<mongoose.LeanDocument<*,*,Chat>>}
   */
  static testFunction(){
    return new Promise(async function(resolve,reject){
      try{
        const found=await ChatModel.findById("id");
        if(found)
          resolve(found.toObject());
        else
          reject("Reason");
      }catch(ex){
        reject(ex);
      }
    });
  }
}