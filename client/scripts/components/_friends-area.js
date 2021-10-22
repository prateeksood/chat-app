/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="_chat-area.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/chat.js"/>

class ChatItem extends UIHandler.Component {
  /** Elements inside ChatItem */
  #elements;
  /** @type {ChatArea} */
  chatArea = null;
  /** @param {Chat} chat */
  constructor (chat) {
    const events = {};
    events.click = event => {
      App.data.chats.select(chat.id);
    };
    let messageTime, messagePreview;
    const lastMessageAt=chat.messages[chat.messages.length-1]?.createdAt ?? chat.createdAt;
    const element = DOM.create("div", {
      class: "chat-item",
      id: chat.id,
      children: [
        DOM.create("div", {
          class: "dp-holder",
          children: [
            DOM.create("img", {
              src: chat.image,
              alt: "DP"
            })  //img
          ]
        }),  //div.dp-holder
        DOM.create("div", {
          class: "name-holder",
          children: [
            DOM.create("div", {
              class: "user-name",
              html: chat.title,
            }),//div.user-name
            messagePreview=DOM.create("div", {
              class: "msg-preview",
              html: chat.messages[chat.messages.length-1]?.content ?? "Click to start conversation"
            })  //div.msg-preview
          ]
        }),  //div.name-holder
        DOM.create("div", {
          class: "other-info",
          children: [
            messageTime=DOM.create("auto-updater", {
              class: "msg-time",
              html: App.date.format(lastMessageAt)
            })  //div.msg-time
          ]
        })  //div.other-info
      ]
    }, {}, events);  //div.chat-item
    super(chat.id, element);
    this.chatArea = new ChatArea(chat);
    this.#elements={messagePreview,messageTime};
    messageTime.handler=()=>{
      messageTime.innerHTML=App.date.format(lastMessageAt);
    };
  }
  /** @param {Message} message */
  addMessage(message){
    this.chatArea.addMessage(message);
    this.#elements.messagePreview.innerHTML=message.content;
    this.#elements.messageTime.innerHTML=App.date.format(message.createdAt);
    this.#elements.messageTime.handler=()=>{
      this.#elements.messageTime.innerHTML=App.date.format(message.createdAt);
    };
  }
};