const router = require("express").Router();
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/all", async function(request,response){
  try{
    const chats=await Chat.find({});
    response.send(chats);
  }catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.post("/create",async function(request,response){
  try{
    const {senderId, receipentId} = request.body;
    const foundUsers=await User.find({
      $or:[{_id:senderId},{_id:receipentId}]
    });
    if(foundUsers.length===2){
      const chat = new Chat({
        participants: [senderId, receipentId]
      });
      await chat.save();
    }else{
      response.status(500).send("Either senderId or receipentId is incorrect");
    }
  }catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/", authMiddleware, async (request, response) => {
  const {
    _id
  } = request.user
  try {

    const foundChats = await Chat.find({
      "participants._id": _id
    });
    if(foundChats){
      const chatIds=foundChats.map(chat=>{
        return {chatId:chat.id};
      });
      const foundMessages=await Message.find({$or:chatIds});
      response.status(200).json(foundMessages);
      console.log(foundMessages.toObject());
      const oneInEvery=await Message.aggregate([{
        $match:{$or:chatIds}
      },{
         $group:"$chatId"
      }]);
      console.log(oneInEvery.toObject());
    }
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/:chatId/messages", async (request, response) => {
  const {
    chatId
  } = request.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(chatId))
      return response.status(400).send("Invalid chat ID");
    const foundMessages = await Message.find({chatId});
    response.status(200).send(foundMessages);
  } catch (err) {
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

module.exports = router;