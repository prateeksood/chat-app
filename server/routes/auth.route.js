const router=require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/",authMiddleware,(request,response) => {
  if(request.user){
    response.status(200).json(request.user);
  }else{
    response.status(401).send("Invalid Token, Access Denied");
  }
})

module.exports=router;