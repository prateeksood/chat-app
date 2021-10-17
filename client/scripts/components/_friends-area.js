/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="_chat-area.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/chat.js"/>

class ChatItem extends UIHandler.Component{
  /** @type {ChatArea} */
  chatArea=null;
  /** @param {Chat} chat */
  constructor(chat){
    const events={};
    events.click=event=>{
      App.data.chats.select(chat.id);
    };
    const element=DOM.create("div",{
      class:"chat-item",
      id:chat.id,
      children:[
        DOM.create("div",{
          class:"dp-holder",
          children:[
            DOM.create("img",{
              src:chat.image,
              alt:"DP"
            })  //img
          ]
        }),  //div.dp-holder
        DOM.create("div",{
          class:"name-holder",
          children:[
            DOM.create("div",{
              class:"user-name",
              html:chat.title,
            }),//div.user-name
            DOM.create("div",{
              class:"msg-preview",
              html:chat.messages[0]?.content
            })  //div.msg-preview
          ]
        }),  //div.name-holder
        DOM.create("div",{
          class:"other-info",
          children:[
            DOM.create("div",{
              class:"msg-time",
              html:App.date.stringify(chat.messages[0]?.sendAt)
            })  //div.msg-time
          ]
        })  //div.other-info
      ]
    },{},events);  //div.chat-item
    super(chat.id,element);
    this.chatArea=new ChatArea(chat);
  }
};