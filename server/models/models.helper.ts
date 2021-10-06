import { Date,ObjectId } from "mongoose";

interface User{
  username: string;
  name: string;
  password: string;
  email: string;
};

interface Message{
  participants:ObjectId[];
  messages:{
    sender: ObjectId,
    recipient: ObjectId,
    message: string,
    time: Date
  }[];


};