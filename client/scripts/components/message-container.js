/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>


class MessageComponent extends UIHandler.Component {
  /** @param {Message} message */
  constructor (message) {
    const element = DOM.create("div", {
      class: `message-group${App.session.isCurrentUserId(message.senderId) ? " sent" : ""}`,
      children: [
        DOM.create("div", {
          class: "message-container",
          children: [
            DOM.create("div", {
              class: "content",
              html: message.content
            }), // div.content
            DOM.create("div", {
              class: "info",
              children: [
                DOM.create("div", {
                  class: "time",
                  html: App.date.format(message.createdAt)
                }), // div.time
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
        })//div.message-container
      ]
    });//div.message-group

    super("message", element);
  }
}