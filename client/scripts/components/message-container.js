/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>


class MessageComponent extends UIHandler.Component {
  /** @param {Message} message */
  constructor (message) {
    const messageTime=DOM.create("auto-updater", {
      class: "time",
      html: App.date.format(message.createdAt)
    });
    const element = DOM.create("div", {
      class: "message-container",
      children: [
        DOM.create("div", {
          class: "content",
          html: message.content
        }), // div.content
        DOM.create("div", {
          class: "info",
          children: [
            messageTime, // div.time
            DOM.create("div", {
              class: "icon",
              children: [
                DOM.createNS("svg", {
                  viewBox: "0 0 32 32",
                  children: [
                    DOM.createNS("use", {
                      "xlink:href": "#send-alt-filled"
                    })// use
                  ]
                })// svg
              ]
            })// div.icon
          ]
        })// div.info
      ]
    },{},{
      click(){
        element.toggleAttribute("active");
      }
    }); //div.message-container

    super("message", element);
    messageTime.handler=()=>{
      messageTime.innerHTML=App.date.format(message.createdAt);
    };
    const foundUser=sample_users.filter(user=>user.id===message.senderId)[0];
    this.sender=foundUser;
    this.isGroup=message.isGroup;
  }
  /** @param {MessageComponent} component */
  static createMessageGroup(component){
    const isCurrentUser=App.session.isCurrentUserId(component.sender.id);
    return new UIHandler.Component("group",DOM.create("div", {
      senderId:component.sender.id,
      class: `message-group${isCurrentUser ? " sent" : ""}`,
      children: [
        (()=>{
          if(!isCurrentUser && component.isGroup)
            return DOM.create("div",{
              class:"sender",
              text:component.sender.name
            });
        })()
      ]
    })); //div.message-group
  }
}