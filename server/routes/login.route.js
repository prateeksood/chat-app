const router=require("express").Router();
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.model");
const {Document, Query} = require("mongoose");

// router.get("/", function (request, response) {
//   response.sendFile(path.join(__dirname, "../client/login/login.html"));
// });

router.post("/", async function (request, response) {

  const tokenExpiry=2592000;

  try {
    const { username, password } = request.body;
    const foundUser = await User.findOne({ username });
    if(!foundUser)
      response.status(401).send("User does not exist");
    else{
      if(foundUser.password !== password)
        response.status(401).send("Invalid password");
      else{
        jwt.sign(respObj,process.env.JWT_SECRET,{
          expiresIn:tokenExpiry
        },(err,token)=>{
          if(err)
            response.status(500).send(`Something went wrong : ${err.message}`);
          else{
            // Method #1
            const respObj=foundUser._doc; // or foundUser.toObject()
            delete respObj.password;
    
            // Method #2
            // const {password,...respObj}={...foundUser.toObject(),token};
            // console.log(respObj)
    
            // Method #3
            // const respObj=foundUser.toObject({
            //   transform(doc,ret,opt){
            //     ret.token=token;
            //     delete ret.password;
            //   }
            // });

            response.status(200).json({...respObj,token});
          }
        });
      }
    }
  } catch (err) {
    response.status(500).send(err);
  }
});

module.exports =router;