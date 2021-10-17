const express = require("express");
const {WebSocketServer} = require("ws");
const db = require("./db/db");
const loginRoute = require("./routes/login.route");
const registerRoute = require("./routes/register.route");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const chatRoute = require("./routes/chat.route");
const userRoute = require("./routes/user.route");

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use("/", express.static(__dirname + "/../client"));
app.use("/uploads", express.static(__dirname + "/./public/uploads/profilePictures"));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/../index.html");
});

app.use('/auth', authRoute);
app.use('/message', messageRoute);
app.use('/chat', chatRoute);
app.use('/user', userRoute);
app.post("/upload",function(request,response){
  console.log(request.body.naam,request.body.file);
  request.on("data",data=>data);
  response.send({status:"ok"});
});

db.connectToDB();

const PORT = process.env.PORT || 3000;
const server=app.listen(PORT, function () {
  console.log("Listening on Port: " + PORT);
});


const socketServer = new WebSocketServer({server});

socketServer.on("listening",function(){
  console.log("Socket listening");
});
socketServer.on("connection",function(socket,request){

  console.log("Socked connected: ",request.socket.localAddress);
  socket.send(JSON.stringify({
    error:null,data:{connect:true}
  }));

  socket.on("close",function(x){
    console.log("User disconnected",x);
  });
  socket.on("message",function(rawData,isBinary){
    const response={error:null,data:null};
    try{
      const data=JSON.parse(rawData.toString());
      console.log(data);
      response.data={status:"received"};
    }catch(ex){
      response.error={message:ex};
    }
    socket.send(JSON.stringify(response));
  });
});

// server.on("socket",function(request,socket,head){
//   socketServer.handleUpgrade(request,socket,head,soc=>{
//     soc.emit("connection",socket,request);
//   });
// });