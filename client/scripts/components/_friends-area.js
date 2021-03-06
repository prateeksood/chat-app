/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../auto-updater.js"/>
/// <reference path="_chat-area.js"/>
/// <reference path="profile.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/chat.js"/>

/** @extends {UIHandler.Component<HTMLDivElement>} */
class ListItem extends UIHandler.Component {
  /**
   * @param {string} itemId
   * @param {string} imageSrc
   * @param {string} mainText
   * @param {string} subText
   * @param {Date|number} time
   * @param {DOMEvents} events
  */
  constructor (itemId, imageSrc, mainText, subText, time, events = {}) {
    time = new Date(time);
    const element = DOM.create("div", {
      class: "list-item",
      dataOnline: false,
      cId: itemId,
    }, {}, events);

    super(itemId, element);

    this.image = DOM.create("img", {
      src: imageSrc,
      alt: "User Image"
    });
    this.onlineDot = DOM.create("div", {
      class: "online-dot"
    });
    this.mainText = DOM.create("div", {
      class: "main-text",
      html: mainText,
    });
    this.subText = DOM.create("div", {
      class: "sub-text",
      html: subText
    });
    /** @type {AutoUpdater} */
    this.timeText = DOM.create("auto-updater", {
      time: time.getTime(),
      class: "time-text",
      html: App.date.format(time)
    });
    this.timeText.handler = () => {
      DOM.attr(this.timeText, {
        time: time.getTime(),
        html: App.date.format(time)
      });
    };

    DOM.attr(element, {
      children: [
        DOM.create("div", {
          class: "dp-holder",
          children: [
            this.image,  //img
            this.onlineDot
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
      chat.messages[chat.messages.length - 1]?.content ?? "Click to start conversation",
      chat.messages[chat.messages.length - 1]?.createdAt ?? chat.createdAt, {
      click() {
        App.data.chats.select(chat.id);
      },
      contextmenu: event => {
        event.preventDefault();
        this.menu.mount(UI.container.chat, event);
      }
    });
    this.isGroup = chat.isGroup;
    this.participants = chat.participants;
    this.chatArea = new ChatArea(chat);
    this.menu = new UIMenu(chat.id);
    this.menu.addItem("markUnread", "Mark as unread", () => {
      this.toggleUnread();
      this.menu.unmount();
    });
    if (!this.isGroup) {
      this.menu.addItem("profile", "Profile", () => {
        const user = this.participants.filter(({ id }) => !App.session.isCurrentUserId(id))[0];
        const contact = App.session.currentUser.contacts.filter(({ id }) => id === user.id)[0];
        if (contact || user) {
          const profile = new ContactProfile(contact ?? user);
          profile.mount(UI.container.main);
        } else
          App.popError("Contact not found");
        // else{
        //    const profile=new UserProfile(user);
        // }
      });
    }
  }
  /** @param {Message} message */
  addMessage(message) {
    console.log(message);
    message.content = sanitize(message.content);
    this.chatArea.addMessage(message);
    ChatItem.setText(this, message);
  }
  /**
   * @param {number} index
   * @param {Message} message */
  updateMessage(index, message) {
    this.chatArea.updateMessage(index, message);
    ChatItem.setText(this, message);
  }
  /** @param {string|Date} text */
  updateStatus(text) {
    this.attr({ dataOnline: true });
    setTimeout(() => this.attr({ dataOnline: false }), 60000);
    this.chatArea.updateStatus(text);
  }
  /** @param {boolean} [value] */
  toggleUnread(value) {
    const hasAttribute = this.element.toggleAttribute("unread", value);
    this.menu.getItem("markUnread").innerText = hasAttribute ? "Mark as read" : "Mark as unread";
    return hasAttribute;
  }
  /**
   * @param {ChatItem} chatItem
   * @param {Message} message */
  static setText(chatItem, message) {
    const isTempMessage = message.id.includes("temp_");
    if (isTempMessage) {
      chatItem.subText.innerHTML = "<i>" + message.content + "</i>";
      DOM.attr(chatItem.timeText, { text: "sending" });
      chatItem.timeText.handler = () => { };
    } else {
      chatItem.subText.innerHTML = message.content;
      DOM.attr(chatItem.timeText, {
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
      chatItem.timeText.handler = () => {
        DOM.attr(chatItem.timeText, {
          time: message.createdAt.getTime(),
          html: App.date.format(message.createdAt)
        });
      };
    }
  }
}

class ContactItem extends ListItem {
  /** @type {Profile} */
  profile = null;
  /** @param {Contact} user */
  constructor (user) {
    super(user.id, user.image, user.name, user.username, user.lastseen, {
      click: () => {
        App.data.chats.forEach(data => {
          if (data.participants.length === 2 && !data.isGroup) {
            const participant = data.participants.some(participant => participant.id === user.id);
            if (participant) {
              const index = UI.list.chatItems.findIndex(({ id }) => id === data.id);
              if (index >= 0)
                UI.list.chatItems.select(index);
            }
          }
        });
      },
      contextmenu: event => {
        event.preventDefault();
        this.menu.mount(UI.container.chat, event);
      }
    });
    this.profile = new ContactProfile(user);

    // test
    this.menu = new UIMenu(user.id);
    this.menu.addItem("remove", "Remove Contact", () => {
      UI.list.contacts.find((value, index) => {
        if (value.id === this.id) {
          UI.list.contacts.remove(index);
          return true;
        }
      });
      this.menu.remove();
    });
    this.menu.addItem("profile", "Profile", () => {
      this.profile.mount(UI.container.main);
      this.menu.unmount();
    });
  }
}

class UserItem extends ListItem {
  /** @type {Profile} */
  profile = null;
  /** @param {User} user */
  constructor (user) {
    super(user.id, user.image, user.name, user.username, user.lastseen, {
      click: () => {
        this.profile.mount(UI.container.main);
      },
      contextmenu: event => {
        event.preventDefault();
        this.menu.mount(UI.container.chat, event);
      }
    });
    this.profile = new ContactProfile(user);

    this.menu = new UIMenu(user.id);
    this.menu.addItem("chat", "Start Chat", async () => {
      if (App.session.currentUser.hasContact(user.id)) {
        App.data.chats.forEach(data => {
          if (data.participants.length === 2 && !data.isGroup) {
            const participant = data.participants.some(participant => participant.id === user.id);
            if (participant) {
              const index = UI.list.chatItems.findIndex(({ id }) => id === data.id);
              if (index >= 0)
                UI.list.chatItems.select(index);
            }
          }
        });
      } else {
        /** @type {ChatResponse} */
        const response = await App.request("chat/create", {
          method: "POST",
          body: App.createRequestBody({
            participants: [user.id]
          })
        });
        if (response) {
          const chat = Chat.from(response);
          App.data.chats.add(chat.id, chat);
          this.menu.removeItem("chat");
        }
      }
      this.menu.unmount();
    });
    this.menu.addItem("report", "Report", () => {
      App.popAlert("User reported!");
    });
  }
}