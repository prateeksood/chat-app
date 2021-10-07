import {ObjectId, Date} from "mongoose";

interface User{
  username: string;
  name: string;
  password: string;
  email: string;
};

interface Chat{
  participants: ObjectId[];
  messages: {
    sender: ObjectId,
    content: string,
    time: Date
  }[];
};

export {User, Chat};