/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="_chat-area.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/chat.js"/>

class ChatItem extends UIHandler.Component{
  /** @type {ChatArea} */
  #chatArea=null;
  /** @param {Chat} chat */
  constructor(chat){
    const events={};
    events.click=event=>{
      if(!this.#chatArea)
        this.#chatArea=new ChatArea(chat);
    };
    const element=DOM.create("div",{
      class:"chat-item",
      id:_id,
      children:[
        DOM.create("div",{
          class:"dp-holder",
          children:[
            DOM.create("img",{
              src:"#",
              alt:"DP"
            })  //img
          ]
        }),  //div.dp-holder
        DOM.create("div",{
          class:"name-holder",
          children:[
            DOM.create("div",{
              class:"user-name",
              html:username,
            }),//div.user-name
            DOM.create("div",{
              class:"msg-preview",
              html:previewMessages[0].content
            })  //div.msg-preview
          ]
        }),  //div.name-holder
        DOM.create("div",{
          class:"other-info",
          children:[
            DOM.create("div",{
              class:"msg-time",
              html:lastMessageTime
            })  //div.msg-time
          ]
        })  //div.other-info
      ]
    },{},events);  //div.chat-item
    super(chat.id,element);
  }
};