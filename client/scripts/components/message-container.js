/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

/** @extends {UIHandler.Component<HTMLDivElement>} */
class MessageComponent extends UIHandler.Component {
  isGroupMessage=false;
  /** @type {string} */
  sender=null;
  isSent=false;
  /** @param {Message} message */
  constructor (message) {
    const element = DOM.create("div", {
      class: "message-container",
      children: [
        DOM.create("div", {
          class: "content",
          html: message.content
        }) // div.content
      ]
    }, {}, {
      click() {
        element.toggleAttribute("active");
      }
    }); //div.message-container

    super(message.id, element);
    /** @type {AutoUpdater} */
    this.messageTime = DOM.create("auto-updater", {
      time: message.createdAt.getTime(),
      class: "time",
      html: App.date.format(message.createdAt)
    });
    this.messageTime.handler = () => {
      DOM.attr(this.messageTime,{
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
    };
    this.messageInfonull;
    this.sent=message.id.includes("temp_")?false:true;
  }
  /** @param {boolean} value */
  set sent(value){
    this.isSent=value?true:false;
    this.messageInfo?.remove();
    this.messageInfo=MessageComponent.createInfo(this);
    this.element.appendChild(this.messageInfo);
    this.element.toggleAttribute("active",!this.isSent);
  }
  /** @param {Message} message */
  init(message) {
    this.isGroupMessage=message.isGroupMessage;
    this.sender=message.sender;
  }
  /** @param {Message} message */
  update(message){
    DOM.attr(this.messageTime, {
      time: message.createdAt.getTime(),
      html: App.date.format(message.createdAt)
    });
    this.messageTime.handler = () => {
      DOM.attr(this.messageTime,{
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
    };
  }
  /** @param {MessageComponent} component */
  static createMessageGroup(component,g=0) {
    const isCurrentUser = App.session.isCurrentUserId(component.sender._id);
    return new UIHandler.Component("group-"+g, DOM.create("div", {
      senderId: component.sender._id,
      class: `message-group${isCurrentUser ? " sent" : ""}`,
      children: [
        (() => {
          if (!isCurrentUser && component.isGroupMessage)
            return DOM.create("div", {
              class: "sender",
              text: component.sender.name
            });
        })()
      ]
    })); //div.message-group
  }
  /** @param {MessageComponent} component */
  static createInfo(component){
    return DOM.create("div", {
      class: "info",
      children: [
        component.isSent ? component.messageTime : DOM.create("div",{text:"sending"}),
        MessageComponent.createIcon(component.isSent)
      ]
    });
  }
  static createIcon(isSent=false){
    return DOM.create("div", {
      class: "icon",
      children: [
        DOM.createNS("svg", {
          viewBox: "0 0 32 32",
          children: [
            DOM.createNS("use", {
              "xlink:href": isSent?"#send-alt-filled":"#in-progress"
            })// use
          ]
        })// svg
      ]
    });// div.icon
  }
}