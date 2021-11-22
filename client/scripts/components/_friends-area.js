/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="_chat-area.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/chat.js"/>

class ListItem extends UIHandler.Component{
  /**
   * @param {string} itemId
   * @param {string} imageSrc
   * @param {string} mainText
   * @param {string} subText
   * @param {Date|number} time
   * @param {DOMEvents} events
  */
  constructor(itemId,imageSrc,mainText,subText,time,events={}){
    const element=DOM.create("div", {
      class: "list-item",
      cId: itemId,
    }, {}, events);

    super(itemId,element);

    this.image=DOM.create("img", {
      src: imageSrc,
      alt: "User Image"
    });
    this.mainText=DOM.create("div", {
      class: "main-text",
      html: mainText,
    });
    this.subText=DOM.create("div", {
      class: "sub-text",
      html: subText
    });
    this.timeText=DOM.create("auto-updater", {
      class: "time-text",
      html: App.date.format(time)
    });
    this.timeText.handler=()=>{
      this.timeText.innerHTML=App.date.format(time);
    };

    DOM.attr(element,{
      children: [
        DOM.create("div", {
          class: "dp-holder",
          children: [
            this.image  //img
          ]
        }),  //div.dp-holder
        DOM.create("div", {
          class: "info-holder",
          children: [
            this.mainText,  //div.main-text
            this.subText  //div.sub-text
          ]
        }),  //div.info-holder
        DOM.create("div", {
          class: "time-holder",
          children: [
            this.timeText  //div.time-text
          ]
        })  //div.time-holder
      ]
    });
  }
}

class ChatItem extends ListItem {
  /** @type {ChatArea} */
  chatArea = null;
  /** @param {Chat} chat */
  constructor (chat) {
    super(
      chat.id,
      chat.image,
      chat.title,
      chat.messages[chat.messages.length-1]?.content ?? "Click to start conversation",
      chat.messages[chat.messages.length-1]?.createdAt ?? chat.createdAt, {
        click(){
          App.data.chats.select(chat.id);
        }
      }
    );
    this.chatArea = new ChatArea(chat);
  }
  /** @param {Message} message */
  addMessage(message){
    this.chatArea.addMessage(message);
    this.subText.innerHTML=message.content;
    this.timeText.innerHTML=App.date.format(message.createdAt);
    this.timeText.handler=()=>{
      this.timeText.innerHTML=App.date.format(message.createdAt);
    };
  }
};

class UserItem extends ListItem {
  /** @type {Profile} */
  profile = null;
  /** @param {User} user */
  constructor (user) {
    super(user.id, user.image, user.name, user.username, user.lastseen, {
      click:()=>{
        this.profile.mount(UI.container.main);
      },
      contextmenu:event=>{
        event.preventDefault();
        this.menu.mount(UI.container.chat,event);
      }
    });
    this.profile = new ContactProfile(user);

    // test
    this.menu=new UIMenu(user.id);
    this.menu.addItem("remove","Remove Contact",()=>{
      UI.list.contacts.delete(user.id);
      this.menu.remove();
    });
    this.menu.addItem("chat","Chat",()=>{
      const chat=App.data.chats.find(function(data){
        if(data.participants.length===2){
          const participant=data.participants.find(participant=>participant.id===user.id);
          if(participant)
            return true
          else return false;
        }
      });
      if(chat && UI.list.chatItems.has(chat.id)){
        UI.list.chatItems.select(chat.id);
        this.menu.unmount();
      }
    });
  }
}