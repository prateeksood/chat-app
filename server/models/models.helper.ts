import { ObjectId, Date } from "mongoose";

interface User {
  username: string;
  email: string;
  name: string;
  password: string;
  image: string;
  lastseen: Date;
  contacts: {
    userId: ObjectId, // User.id
    since: Date
  }[];
  requests: {
    userId: ObjectId, // User.id
    since: Date
  }[];
  blocked: {
    userId: ObjectId, // User.id
    since: Date
  }[];
}

interface Chat {
  title: string; // In groups: Group Name, In personal chat: null
  participants: {
    userId: ObjectId, // User.id
    since: Date
  }[];
}

interface Message {
  chatId: ObjectId; // Chat.id
  senderId: ObjectId; // User.id
  content: string;
  referenceId: ObjectId; // Message.id (reference to the message when replied)
  sentAt: Date;
  receivedBy: {
    userId: ObjectId, // User.id
    time: Date
  }[];
  readBy: {
    userId: ObjectId, // User.id
    time: Date
  }[];
  deletedBy: {
    userId: ObjectId, // User.id
    time: Date
  }[];
}

export { User, Chat, Message };