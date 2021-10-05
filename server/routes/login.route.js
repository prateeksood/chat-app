const router=require("express").Router();
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.model");

router.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "../client/login/login.html"));
});

router.post("/", async function (request, response) {

  const tokenExpiry=2592000;

  try {
    const { username, password } = request.body;
    let foundUser = await User.findOne({ username });
    if (!foundUser) response.status(401).send("User does not exist");
    else {
      if (foundUser.password !== password)
        response.status(401).send("Invalid password");
      else {
        foundUser=foundUser._doc;
        delete foundUser.password;
        jwt.sign(foundUser,process.env.JWT_SECRET,{expiresIn:tokenExpiry},(err,token)=>{
          if(err)
            response.status(500).send(`Something went wrong : ${err.message}`);
          else{
            foundUser={...foundUser,token}
            response.status(200).json(foundUser);
          }
        })
        
      }
    }
  } catch (err) {
    response.status(500).send(err);
  }
});

module.exports =router;