/// <reference path="types.d.ts"/>

class Chat{
  /** @type {string} */
  title=null;
  /**
   * @param {string} id
   * @param {User[]} participants
   * @param {Message[]} messages
   */
  constructor(id,participants=[],messages=[]){
    this.id=id;
    this.participants=participants;
    this.messages=messages;
  }
  /** @param {ChatResponse} chatResponse */
  static from(chatResponse){
    const {id,participants,messages}=chatResponse;
    const chat=new Chat(
      id,
      participants.map(user=>User.from(user)),
      messages.map(message=>Message.from(message))
    );
    chat.title=chatResponse.title??null;
    return chat;
  }
};

class Message{
  /** @type {{userId:string,time:Date}[]} */
  receivedBy=[];
  /** @type {{userId:string,time:Date}[]} */
  readBy=[];
  /** @type {{userId:string,time:Date}[]} */
  deletedBy=[];
  /**
   * @param {string} id
   * @param {string} chatId
   * @param {string} senderId
   * @param {string} content
   * @param {Date} sendAt
   * @param {string} [referenceId]
   */
  constructor(id,chatId,senderId,content,sendAt,referenceId=null){
    this.id=id;
    this.chatId=chatId;
    this.senderId=senderId;
    this.content=content;
    this.sendAt=sendAt;
    this.referenceId=referenceId;
  }
  /** @param {MessageResponse} messageResponse */
  static from(messageResponse){
    const {id,chatId,senderId,content,sendAt,referenceId}=messageResponse;
    const message=new Message(id,chatId,senderId,content,sendAt,referenceId??null);
    message.receivedBy=messageResponse.receivedBy??[];
    message.deletedBy=messageResponse.deletedBy??[];
    message.readBy=messageResponse.readBy??[];
    return message;
  }
};