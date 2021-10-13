interface UserResponse {
  userID: String;
  userName: String;
  name: String;
}

interface MessageResponse{
  _id: String;
  sender: String;
  receipent: String;
  updatedAt: Date;
}

interface ChatResponse{
  _id: String;
  participants: UserResponse[];
  previewMessages: MessageResponse[];
}