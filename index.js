/// <reference path="globals.d.ts"/>

const express = require("express");
const { WebSocketServer } = require("ws");
const db = require("./db/db");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const chatRoute = require("./routes/chat.route");
const userRoute = require("./routes/user.route");
const contactRoute = require("./routes/contact.route");
const UserService = require("./services/user.service");
const { createContact } = require("./controllers/contact.controller");

const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use("/", express.static(__dirname + "/./client"));
app.use("/resources/profilePictures", express.static(__dirname + "/./public/uploads/profilePictures"));
app.use("/resources/illustrations", express.static(__dirname + "/./public/Resources/illustrations"));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/../index.html");
});

app.use('/auth', authRoute);
app.use('/message', messageRoute);
app.use('/chat', chatRoute);
app.use('/contact', contactRoute);
app.use('/user', userRoute);
app.post("/upload", function (request, response) {
  console.log(request.body.naam, request.body.file);
  request.on("data", data => data);
  response.send({ status: "ok" });
});

db.connectToDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log("Listening on Port: " + PORT);
});


const socketServer = new WebSocketServer({ server });
global.connections = {};
socketServer.on("listening", function () {
  console.log("Socket listening");
});
socketServer.on("connection", function (socket, request) {
  if (!request.headers.cookie) {
    socket.send(JSON.stringify({ error: "Kindly login to continue", data: null, type: null }));
    return;
  }
  const user = UserService.getLoggedInUser(request.headers.cookie);
  if (!user) {
    socket.send(JSON.stringify({ error: "Kindly login to continue", data: null, type: null }));
    return;
  }
  global.connections[user._id] = { userRefs: [], socket };
  console.log("Socked connected: ", request.url, "for", user._id);
  console.log("here", (new Date()))
  // console.log({ connection: global.connections });

  socket.send(JSON.stringify({
    error: null, type: "connection", data: { user }
  }));

  socket.on("close", function (x) {
    delete global.connections[user._id];
    // console.log("User disconnected", x, global.connections);
  });
  socket.on("message", function (rawData, isBinary) {
    const response = { error: null, data: null, type: "message", dataType: null };
    try {
      /** @type {{type:"userRefs"|"kuch_aur",content:any}} */
      const data = JSON.parse(rawData.toString());
      response.dataType = data.type;
      switch (data.type) {
        case "userRefs":
          // console.log(data.content);
          global.connections[user._id].userRefs = [];
          data.content.forEach(id => {
            if (typeof id === "string")
              global.connections[user._id].userRefs.push(id);
          });
          break;
        case "kuch_aur":
          break;
      }
      response.data = { status: "received" };
    } catch (ex) {
      response.error = { message: ex };
    }
    // console.log(JSON.stringify(response));
  });
});

setInterval(async function () {
  const lastSeen = new Date();
  for (let userId in global.connections) {
    const user = await UserService.findUserByIdAndUpdate(userId, { lastSeen });
    // user.contacts.filter(contact=>contact.user in global.connections)
    const contacts = [];
    // console.log(user.name, user.contacts.map(c => [c.user, global.connections[c.user]?.userRefs]));
    for (let contact of user.contacts) {
      if (contact.user in global.connections && global.connections[contact.user].userRefs.includes(userId))
        contacts.push(contact);
    }
    global.connections[userId].socket.send(JSON.stringify({
      error: null, type: "activeContacts", data: { contacts }
    }));
  }
}, 10000);

// server.on("socket",function(request,socket,head){
//   socketServer.handleUpgrade(request,socket,head,soc=>{
//     soc.emit("connection",socket,request);
//   });
// });