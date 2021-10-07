const express = require("express");
const db = require("./db/db");
const loginRoute = require("./routes/login.route");
const registerRoute = require("./routes/register.route");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

const app = express();
const server = require("http").createServer(app);

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use("/", express.static(__dirname + "/../client"));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/../index.html");
});

app.use('/login', loginRoute)
app.use('/register', registerRoute)
app.use('/auth', authRoute);
app.use('/message', messageRoute);

db.connectToDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("Listening on Port: " + PORT);
});