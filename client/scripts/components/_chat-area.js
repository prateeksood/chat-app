/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../sessions.js" />

class ChatArea extends UIHandler.Component {
  /**
   * To manage message components
   * @type {UIHandler.ComponentList<MessageComponent>}
  */
  #messages = new UIHandler.ComponentList();

  /** @param {Chat} chat */
  constructor (chat) {

    const rightMain = new UIHandler.Component(
      "rightMain",
      DOM.create("div", {
        class: "right-main"
      })  // div.right-main
    );
    const element = DOM.create("div", {
      class: "chat-area",
      children: [
        ChatArea.createTopBar(chat),
        rightMain.element,
        ChatArea.createBottomBar(chat)
      ]
    });  // div.chat-area

    super("chatArea", element);
    this.addSub(rightMain);

    /** @type {UIHandler.Component} */
    let lastGroup = null;
    // Whenever a Message component is inserted into the this.#messages using this.#messages.insert method
    this.#messages.on("insert", component => {
      if (!lastGroup) {
        lastGroup = MessageComponent.createMessageGroup(component);
      }
      if (lastGroup.getAttr("sender-id") !== component.sender._id) {
        lastGroup = MessageComponent.createMessageGroup(component);
      }
      lastGroup.mount(rightMain);
      component.mount(lastGroup);
    });
    // Whenever a Message component is deleted from the this.#messages using this.#messages.delete method
    this.#messages.on("delete", component => {
      component.unmount();
    });

    chat.messages.forEach(message => this.addMessage(message));

  }
  /** @param {Message} message */
  async addMessage(message) {
    const component = new MessageComponent(message);
    await component.init(message);
    this.#messages.insert(component);
  }
  /** @param {Chat} chat */
  static createTopBar(chat) {
    return DOM.create("div", {
      class: "top-bar top-bar-right",
      children: [
        DOM.create("div", {
          class: "dp-holder",
          children: [
            DOM.create("img", {
              src: chat.image,
              alt: "DP"
            })  //img
          ]
        }), //div.dp-holder
        DOM.create("div", {
          class: "name-holder",
          children: [
            DOM.create("div", {
              class: "user-name",
              html: chat.title
            }), // div.user-name
            DOM.create("div", {
              class: "msg-preview",
              html: "active now"
            })//div.message-preview
          ]
        }),// div.name-holder
        DOM.create("div", {
          class: "icons",
          children: [
            DOM.create("button", {
              class: "icon",
              title: "Search",
              children: [
                DOM.createNS("svg", {
                  viewBox: "0 0 32 32",
                  children: [
                    DOM.createNS("use", {
                      "xlink:href": "#search"
                    }) //use
                  ]
                }) //svg.icon
              ]
            }) //div.icons
          ]
        }) //div.icons
      ]
    }) // div.top-bar
  }
  /** @param {Chat} chat */
  static createBottomBar(chat) {
    return DOM.create("div", {
      class: "bottom-bar bottom-bar-right",
      children: [
        DOM.create("form", {
          class: "send-area",
          action: "chat/" + chat.id + "/send",
          method: "POST",
          children: [
            DOM.create("input", {
              type: "text",
              name: "content",
              placeholder: "Type a message...",
              autocomplete: "off"
            }),//input
            DOM.create("button", {
              type: "submit",
              class: "icon",
              children: [
                DOM.createNS("svg", {
                  viewBox: "0 0 32 32",
                  children: [
                    DOM.createNS("use", {
                      "xlink:href": "#send-filled"
                    })// use
                  ]
                })//svg
              ]
            })//div.icon
          ]
        }, {/* No styles */ }, {
          submit(event) {
            event.preventDefault();
            App.sendMessage(event.currentTarget);
            event.currentTarget.reset();
          } // onsubmit
        }), // div.send-area
      ]
    }); //div.bottom-bar
  }
};