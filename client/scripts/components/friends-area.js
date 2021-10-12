/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>


class friendsArea extends UIHandler.Component{
  /**
   * 
   * @param {string} _id
   * @param {string} username 
   * @param {string} previewMessage 
   * @param {Date} lastMessageTime 
   */
  constructor(_id,username,previewMessages,lastMessageTime){
    let events={};
    events.click=event=>{
        
        if(document.querySelector(".top-bar-right"))document.querySelector(".top-bar-right").remove();
        if(document.querySelector("#right-main"))document.querySelector("#right-main").remove();
        if(document.querySelector(".bottom-bar-right"))document.querySelector(".bottom-bar-right").remove();
        const topBar=new ChatArea.TopBar(username,_id);
        topBar.mount(UI.container.chat.sub.messagesArea);
        const chatArea= new ChatArea(this.element.id,previewMessages);
        chatArea.mount(UI.container.chat.sub.messagesArea);
        const bottomBar=new ChatArea.BottomBar(username,_id);
        bottomBar.mount(UI.container.chat.sub.messagesArea);
    }
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
            })//img
          ]
        }),//div.dp-holder
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
            })//div.msg-preview
          ]
        }),//div.name-holder
        DOM.create("div",{
          class:"other-info",
          children:[
            DOM.create("div",{
              class:"msg-time",
              html:lastMessageTime
            })//div.msg-time
          ]
        })//div.other-info
      ]
    },{},events)//div.chat-item
     
    super("friendsArea",element);
  }
}