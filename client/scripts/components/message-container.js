/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>


class MessageComponent extends UIHandler.Component {
  /** @param {Message} message */
  constructor (message) {
    const messageTime = DOM.create("auto-updater", {
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
      messageTime.innerHTML = App.date.format(message.createdAt);
    };
  }
  async init(message) {

    try {
      const response = await fetch(
        `/user/${message.senderId}`, {
        method: "GET"
      });
      if (response.ok) {
        const user = await response.json();
        this.sender = user;
      }
    }
    catch (ex) {
      consple.log(ex);
    }
    finally {
      this.isGroup = message.isGroup ?? false;
    }
  }
  /** @param {MessageComponent} component */
  static createMessageGroup(component) {
    const isCurrentUser = App.session.isCurrentUserId(component.sender._id);
    return new UIHandler.Component("group", DOM.create("div", {
      senderId: component.sender._id,
      class: `message-group${isCurrentUser ? " sent" : ""}`,
      children: [
        (() => {
          if (!isCurrentUser && component.isGroup)
            return DOM.create("div", {
              class: "sender",
              text: component.sender.name
            });
        })()
      ]
    })); //div.message-group
  }
}