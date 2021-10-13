class Chat{
  /**
   * @param {String} id
   * @param {Message[]} messages
   */
  constructor(id,messages=[]){
    this.id=id;
    this.messages=messages;
  }
  /** @param {Chat} chatObject */
  from(chatObject){
    const {id,messages}=chatObject;
    const chat=new Chat(id,messages.map(message=>Message.from(message)));
    return chat;
  }
};

class Message{
  /**
   * @param {string} id
   * @param {string} senderId
   * @param {string} content
   * @param {Date} time
   */
  constructor(id,senderId,content,time){
    this.id=id;
    this.senderId=senderId;
    this.content=content;
    this.time=time;
  }
  /** @param {Message} messageObject */
  from(messageObject){
    const {id,senderId,content,time}=messageObject;
    const message=new Message(id,senderId,content,time);
    return message;
  }
};