const express=require("express");
const app=express();
const server=require("http").createServer(app);
const path=require("path");

app.use("/",express.static(__dirname+"/../client"));

app.get("/",function(request,response){
  response.sendFile(__dirname+"/../index.html");
});
app.get("/login",function(request,response){
  response.sendFile(path.join(__dirname,"../client/login/register.html"));
});

app.post("/login",function(request,response){
  console.log(request.query,request.params,request.body);
  response.send(request.body);
});

const PORT=process.env.PORT||3000;
server.listen(PORT,function(){
  console.log("Listening on Port: "+PORT);
});