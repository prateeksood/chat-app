const express=require("express");
const User = require("./models/User");
const app=express();
const server=require("http").createServer(app);
const path=require("path");
const db=require("./db/db");

app.use(express.urlencoded({extended:true}));
app.use("/",express.static(__dirname+"/../client"));

app.get("/",function(request,response){
  response.sendFile(__dirname+"/../index.html");
});
app.get("/login",function(request,response){
  response.sendFile(path.join(__dirname,"../client/login/login.html"));
});

app.post("/login",async function(request,response){
  try{

    const {username,password} = request.body;
    let foundUser=await User.findOne({username});
    if(!foundUser)
      response.status(200).send('User does not exists');
    else{
      if(foundUser.password!=password)
        response.status(200).send('Invalid password');
      else{
        foundUser.password = undefined;
        response.status(200).send(foundUser);
      }
    }

  }
  catch(err){
    response.status(500).send(err);
  }
  
});

app.post("/register",async function(request,response){
  try{

    const {fullName,email,password,username} = request.body;
    let existingUser=await User.findOne({email});
    let existingUsername=await User.findOne({username});
    if(existingUser){
      response.status(200).send('Email already exists, try again with different email');
    }
    else if(existingUsername){
      response.status(200).send('Username already taken, try again with different username');
    }
    else{
      let newUser = await new User({name:fullName,email,password,username});
      let savedUser=await newUser.save();
      newUser.password=undefined;
      response.status(200).send(newUser);
    }
  }
  catch(err){
    response.status(500).send(`Something went wrong : ${err.message}`);
  }
});

db.connectToDB();

const PORT=process.env.PORT||3000;
server.listen(PORT,function(){
  console.log("Listening on Port: "+PORT);
});