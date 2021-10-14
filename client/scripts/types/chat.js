/// <reference path="types.d.ts"/>

class Chat{
  /** @type {string} */
  title=null;
  /**
   * @param {String} id
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
  /** @param {MessageResponse} messageResponse */
  static from(messageResponse){
    const {_id,_senderId,content,time}=messageResponse;
    const message=new Message(id,senderId,content,time);
    return message;
  }
};