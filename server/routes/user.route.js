const router = require("express").Router();
const User = require("../models/User.model");

router.get("/all",async function(request,response){
  try{
    const users=await User.find({});
    response.send(users);
  }catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/search",async function(request,response){
  try{
    const {username, name}=request.query;
    const users=await User.find({
      $or:[{username},{name}]
    });
    response.send(users);
  }catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

router.get("/:userId/info",async function(request,response){
  try{
    const user=await User.findById(request.params.userId);
    if(user)
      response.status(200).json(user);
    else
      response.status(500).send("User not found");
  }catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

module.exports=router;