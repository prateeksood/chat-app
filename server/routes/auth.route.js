const router=require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const UserService = require("../services/user.service");

router.post("/",authMiddleware,async (request,response) => {
  if(request.user){
    try{
      response.status(200).json(await UserService.getUserByID(request.user._id));
    }catch(ex){
      response.status(401).send("User not found");
    }
  }else{
    response.status(401).send("Invalid Token, Access Denied");
  }
});

module.exports=router;