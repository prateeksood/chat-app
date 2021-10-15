import { ObjectId, Date } from "mongoose";

interface User {
  username: string;
  email: string;
  name: string;
  password: string;
  image: string;
  lastseen: Date;
  contacts: {
    user: ObjectId, // User.id
    since: Date
  }[];
  requests: {
    user: ObjectId, // User.id
    since: Date
  }[];
  blocked: {
    user: ObjectId, // User.id
    since: Date
  }[];
}

interface Chat {
  title: string; // In groups: Group Name, In personal chat: null
  participants: {
    user: ObjectId, // User.id
    since: Date
  }[];
}

interface Message {
  chat: ObjectId; // Chat.id
  sender: ObjectId; // User.id
  content: string;
  reference: ObjectId; // Message.id (reference to the message when replied)
  sentAt: Date;
  receivedBy: {
    user: ObjectId, // User.id
    time: Date
  }[];
  readBy: {
    user: ObjectId, // User.id
    time: Date
  }[];
  deletedBy: {
    user: ObjectId, // User.id
    time: Date
  }[];
}

interface UserResponse{
  id: string;
  username: string;
  name: string;
  lastSeen: number;
  image: string;
}

interface ChatResponse{
  id: string;
  participants: {
    id: string,
    username: string,
    name: string,
    since: number
  };
}

interface FullChatResponse{
  id: string;
  participants: {
    id: string,
    username: string,
    name: string,
    since: number
  };
  messages: Message[]
}

export { User, Chat, Message, UserResponse, ChatResponse, FullChatResponse};