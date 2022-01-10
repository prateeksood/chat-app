/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

/** @extends {UIHandler.Component<HTMLDivElement>} */
class MessageComponent extends UIHandler.Component {
  isGroupMessage=false;
  /** @type {string} */
  sender=null;
  /** @param {Message} message */
  constructor (message) {
    const messageTime = DOM.create("auto-updater", {
      time: message.createdAt.getTime(),
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
    }, {}, {
      click() {
        element.toggleAttribute("active");
      }
    }); //div.message-container

    super("message", element);
    messageTime.handler = () => {
      DOM.attr(messageTime,{
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
    };
    this.messageTime=messageTime;
  }
  /** @param {Message} message */
  init(message) {
    this.isGroupMessage=message.isGroupMessage;
    this.sender=message.sender;
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
}