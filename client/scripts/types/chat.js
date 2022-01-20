/// <reference path="types.d.ts"/>

class Chat {
  /** @type {string} */
  title = null;
  /** @type {Date} */
  createdAt = null;
  isGroup = false;
  /**
   * @param {string} id
   * @param {Participant[]} participants
   * @param {Message[]} messages
   */
  constructor (id, participants = [], messages = []) {
    this.id = id;
    this.participants = participants;
    this.messages = messages;
    this.createdAt = Date.now();
    const participant = App.session.isCurrentUserId(participants[0].id) ? participants[1] ?? participants[0] : participants[0];
    this.image = participant.image;
    this.title = participant.name;
  }
  /** @param {ChatResponse} chatResponse */
  static from(chatResponse) {
    const { _id, participants, messages } = chatResponse;
    const users = participants.map(participant => Participant.from(participant));
    const chat = new Chat(
      _id,
      users,
      messages.reverse().map(message => {
        message.isGroupMessage = chatResponse.isGroupChat ?? false;
        return Message.from(message);
      })
    );
    chat.title = chatResponse.title ?? null;
    chat.isGroup = chatResponse.isGroupChat ?? false;
    if (chatResponse.createdAt)
      chat.createdAt = new Date(chatResponse.createdAt);
    if (chat.isGroup) {
      chat.image = chatResponse.image ?? Chat.defaultImage;
    } else {
      const participant = App.session.isCurrentUserId(users[0].id) ?
        users[1] ?? users[0] : users[0];
      chat.title = participant.name;
      chat.image = participant.image ?? User.defaultImage;
    }
    return chat;
  }
  static get defaultImage() {
    return "resources/images/group.png"
  }
  getOtherParticipant() {
    if (this.isGroup)
      return null;
    else
      return this.participants.filter(p => !App.session.isCurrentUserId(p.id))[0];
  }
  getMessageInfo(messageId) {
    /** @type {{message:Message,readBy:Participant[],receivedBy:Participant[]}} */
    const info = { message: null, readBy: [], receivedBy: [] };
    this.messages.some(message => {
      if (message.id === messageId) {
        info.readBy = this.participants.filter(participant => participant.lastRead.time >= message.createdAt);
        info.message = message;
        return true;
      }
    });
    return info;
  }
}

class Message {
  /** @type {{userId:string,time:Date}[]} */
  receivedBy = [];
  /** @type {{userId:string,time:Date}[]} */
  readBy = [];
  /** @type {{userId:string,time:Date}[]} */
  deletedBy = [];
  /**
   * @param {string} id
   * @param {string} chatId
   * @param {UserResponse} sender
   * @param {string} content
   * @param {Date} createdAt
   * @param {string} [referenceId]
   */
  constructor (id, chatId, sender, content, createdAt, referenceId = null) {
    this.id = id;
    this.chatId = chatId;
    this.sender = sender;
    this.content = content;
    this.createdAt = createdAt;
    this.referenceId = referenceId;
  }
  /** @param {MessageResponse} messageResponse */
  static from(messageResponse) {
    const { _id, chat, sender, content, createdAt, reference } = messageResponse;
    const message = new Message(_id, chat, sender, content, new Date(createdAt), reference ?? null);
    message.receivedBy = messageResponse.receivedBy ?? [];
    message.deletedBy = messageResponse.deletedBy ?? [];
    message.readBy = messageResponse.readBy ?? [];
    return message;
  }
}

class Participant extends User {
  /** @param {User} user */
  constructor (user, since = Date.now()) {
    super(user.id, user.username, user.name);
    this.lastseen = user.lastseen;
    this.since = since;
    this.gender = user.gender;
    this.image = user.image;
    /** @type {{messageId:string,time:Date}} */
    this.lastRead = { messageId: null, time: null }
    /** @type {{messageId:string,time:Date}} */
    this.lastReceived = { messageId: null, time: null };
    this.hasAcceptedInvite = false;
  }
  /** @param {ParticipantResponse} response */
  static from(response) {
    const participant = new Participant(User.from(response.user), response.since);
    participant.hasAcceptedInvite = response.meta?.hasAcceptedInvite ?? false;
    participant.lastRead = response.meta?.lastRead ?? {};
    participant.lastReceived = response.meta?.lastReceived ?? {};
    participant.lastRead.time = new Date(participant.lastRead?.time);
    participant.lastReceived.time = new Date(participant.lastReceived?.time);
    return participant;
  }
}