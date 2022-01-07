interface UserResponse {
  _id: String;
  username: String;
  name: String;
}

interface ChatUserResponse {
  _id: String;
  since: Date;
  user: UserResponse;
}

interface MessageResponse{
  _id: String;
  chat: String;
  sender: UserResponse[];
  receipent: String;
  content: String;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: UserResponse[];
  deletedBy: UserResponse[];
  receivedBy: UserResponse[];
}

interface ChatResponse{
  _id: String;
  groupAdmins: String[];
  isGroupChat: Boolean;
  title: string;
  participants: ChatUserResponse[];
  messages: MessageResponse[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}