const express = require("express");
const db = require("./db/db");
const loginRoute= require("./routes/login.route")
const registerRoute= require("./routes/register.route")

const app = express();
const server = require("http").createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/../client"));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/../index.html");
});

app.use('/login',loginRoute)
app.use('/register',registerRoute)

db.connectToDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("Listening on Port: " + PORT);
});
