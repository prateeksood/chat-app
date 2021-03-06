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
  scrolledTop = 0;
  /** @param {Chat} chat */
  constructor (chat) {
    const elements = {
      ...ChatArea.createTopBar(chat),
      ...ChatArea.createBottomBar(chat)
    };

    const rightMain = new ChatArea.RightMain();
    const element = DOM.create("div", {
      class: "chat-area",
      children: [
        elements.topBar,
        rightMain.element,
        elements.bottomBar
      ]
    });  // div.chat-area

    super("chatArea", element);
    this.addSub(rightMain);
    this.elements = elements;

    // Whenever a Message component is inserted into the this.#messages using this.#messages.insert method
    this.#messages.on("add", (component, index) => {
      const group = rightMain.getGroup(component, index);
      group.addChildren([component]);
      if (index > 0)
        component.element.scrollIntoView({ block: "nearest" });

    });
    // Whenever a Message component is deleted from the this.#messages using this.#messages.remove method
    this.#messages.on("remove", component => {
      component.unmount();
    });
    // this.#messages.on("update",(index,component)=>{
    //   component
    // });

    chat.messages.forEach(message => this.addMessage(message));

  }
  /** @param {Message} message */
  addMessage(message, atTop = false) {
    const component = new MessageComponent(message);
    component.init(message);
    this.#messages.add(component, atTop ? 0 : -1);
    // if (!App.session.isCurrentUserId(message.sender._id))
    // this.updateStatus(message.createdAt);
  }
  /**
   * @param {number} index
   * @param {Message} message */
  updateMessage(index, message) {
    const component = this.#messages.get(index);
    component.sent = true;
    component.id = message.id;
    component.contentElement.innerHTML = message.content;
    // this.#messages.update(index,component);
  }
  getMessageCount() {
    return this.#messages.length;
  }
  get messages() {
    return this.#messages;
  }
  /** @param {Date|String} text */
  updateStatus(text) {
    if (typeof text === "string")
      this.elements.subText.handler = () => this.elements.subText.innerHTML = text;
    else
      this.elements.subText.handler = () => {
        const time = App.date.format(text);
        this.elements.subText.innerHTML = time === "just now" ? "Online" : `Last seen ${lastSeenTime} ago`;
      };
  }
  /** @param {Chat} chat */
  static createTopBar(chat) {
    const image = DOM.create("img", {
      src: chat.image,
      alt: "DP"
    }); // img
    const mainText = DOM.create("div", {
      class: "main-text",
      html: chat.title
    });
    /** @type {AutoUpdater} */
    const subText = DOM.create("auto-updater", {
      class: "sub-text"
    });
    const topBar = DOM.create("div", {
      class: "top-bar top-bar-right",
      children: [
        DOM.create("div", {
          class: "dp-holder",
          children: [image]
        }), // div.dp-holder
        DOM.create("div", {
          class: "info-holder",
          children: [
            mainText, // div.user-name
            subText // div.message-preview
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
    }); // div.top-bar
    return { topBar, image, mainText, subText };
  }
  /** @param {Chat} chat */
  static createBottomBar(chat) {
    const sendForm = DOM.create("form", {
      class: "send-area",
      action: "chat/" + chat.id + "/send",
      method: "POST",
      children: [
        DOM.create("input", {
          type: "hidden",
          name: "chatId",
          value: chat.id,
          disabled: true
        }),
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
    });
    const bottomBar = DOM.create("div", {
      class: "bottom-bar bottom-bar-right",
      children: [
        sendForm // div.send-area
      ]
    }); //div.bottom-bar
    return { bottomBar, sendForm };
  }
};

/** @extends {UIHandler.Component<HTMLDivElement>} */
ChatArea.RightMain = class RightMain extends UIHandler.Component {
  /** @type {[group:UIHandler.Component<HTMLDivElement>]} */
  #groups = [];
  constructor () {
    super(
      "rightMain",
      DOM.create("div", {
        class: "right-main"
      })  // div.right-main
    );
  }
  get groups() {
    return this.#groups;
  }
  /** @param {MessageComponent} component */
  getGroup(component, messageIndex = null) {
    const messages = this.#groups.flatMap(group => group.children);
    let group;
    if (messageIndex === null)
      messageIndex = messages.length;
    // console.log(component.element.children[0],messages.length,messageIndex);
    // debugger;
    if (messages.length <= 0) {
      group = MessageComponent.createMessageGroup(component, this.#groups.length);
      this.#groups.push(group);
      group.mount(this);
    } else if (messages.length > messageIndex) {
      group = messages[messageIndex].parentComponent;
      // console.log(group.children.map(c=>c.element.children[0].textContent),component.sender._id)
      if (group.getAttr("sender-id") !== component.sender._id) {
        const new_group = MessageComponent.createMessageGroup(component, this.#groups.length);
        const groupIndex = this.#groups.findIndex(g => g === group);
        this.#groups.splice(groupIndex, 0, new_group);
        new_group.mountBefore(group);
        group = new_group;
      }
    } else if (messages.length === messageIndex) {
      group = messages[messageIndex - 1].parentComponent;
      if (group.getAttr("sender-id") !== component.sender._id) {
        const new_group = MessageComponent.createMessageGroup(component, this.#groups.length);
        this.#groups.push(new_group);
        new_group.mountAfter(group);
        group = new_group;
      }
    }
    return group;
  }
  createGroup(component) {
    const group = MessageComponent.createMessageGroup(component);
    this.#groups.push(group);
    group.mount(this);
    return group;
  }
}