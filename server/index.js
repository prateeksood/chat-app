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
      response.status(200).send('User does not exist');
    else{
      if(foundUser.password!==password)
        response.status(200).send('Invalid password');
      else{
        delete foundUser.password;
        response.status(200).send(foundUser);
      }
    }

  }
  catch(err){
    response.status(500).send(err);
  }

});

const dataValidation={
  email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  username:/^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
  password:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/
};

app.post("/register",async function(request,response){
  try{
    const {fullName,email,password,confirmPassword,username} = request.body;
    let existingUser=await User.findOne({email});
    let existingUsername=await User.findOne({username});
    if(existingUser){
      response.status(200).send('Email already exists, try again with different email');
    }
    else if(existingUsername){
      response.status(200).send('Username already taken, try again with different username');
    }
    else if(!dataValidation.username.test(username)){
      response.status(200).send("Invalid username, Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)");
    }
    else if(!dataValidation.email.test(email)){
      response.status(200).send("Invalid email adress");
    }
    else if(!dataValidation.password.test(password)){
      response.status(200).send("Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character");
    }
    else if(password!==confirmPassword){
      response.status(200).send("Password does not match");
    }
    else{
      let newUser = await new User({
        name:fullName,
        email,
        password,
        username:username.toLowerCase()
      });
      let savedUser=await newUser.save();
      delete newUser.password;
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