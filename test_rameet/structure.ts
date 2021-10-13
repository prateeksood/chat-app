interface User {
  id: string;  // User._id
  username: string;
  email: string;
  name: string;
  password: string;
  image: string;
  lastseen: Date;
  contacts: {
    userId: string[], // User.id[]
    since: Date
  };
  requestsId: {
    userId: string[], // User.id[]
    since: Date
  };
  blockedId: {
    userId: string[], // User.id[]
    since: Date
  };
}

interface Chat {
  id: string; // Chat._id
  title: string; // In groups: Group Name, In personal chat: null
  participantsId: {
    userId: string[], // User.id[]
    since: Date
  };
}

interface Message {
  id: string; // Message._id
  chatId: string; // Chat.id
  senderId: string; // User.id
  content: string;
  referenceId: string; // Message.id (reference to the message when replied)
  sentAt: Date;
  receivedBy: {
    userId: string, // User.id
    time: Date
  }[];
  readBy: {
    userId: string, // User.id
    time: Date
  }[];
  // not sure about this
  deletedBy: {
    userId: string, // User.id
    time: Date
  }[];
}

/*
  Routes:

  /user
    /register ?username &email &name &password &confirmPassword
    /login ?username &password
    /auth
    /logout
    /user_id
      /request ?type = send|accept|remove  (not sure about this)
      /block ?unblock = null|true  (not sure about this)

  /users
    /search ?query = username|name

  /chat
    /create ?participants = user_id_1,user_id_2,...,user_id_n &title = string
    /chat_id
      /messages ?time = timestamp &limit = number
        /send ?content = string &reference = message_id
        /search ?query = string

  /message
    /message_id
      /read
      /delete
*/

/*
 time: Get messages that were sent after the previous checked time (timestamp)
 limit: Limit the number of messages when timestamp=0 otherwise it will get all messages in the chat
*/