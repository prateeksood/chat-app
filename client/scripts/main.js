/// <reference path="../data/sample-users.js"/>
/// <reference path="../data/sample-messages.js"/>
/// <reference path="dom.js"/>
/// <reference path="listener.js"/>
/// <reference path="sessions.js"/>
/// <reference path="ui-handler.js"/>
/// <reference path="data-manager.js"/>
/// <reference path="types/types.d.ts"/>
/// <reference path="types/user.js"/>
/// <reference path="types/chat.js"/>
/// <reference path="components/popup.js"/>
/// <reference path="components/context-menu.js"/>
/// <reference path="components/friends-area.js"/>
/// <reference path="components/message-container.js"/>
/// <reference path="components/_friends-area.js"/>
/// <reference path="components/_chat-area.js"/>


const UI = new UIHandler();
const App = new class AppManager {
  #timeout = null;
  session = new Session();  // session.js

  data = {
    /** @type {DataGroup<Chat>} */
    chats: new DataGroup()  // data-manager.js
  };

  socket = new class {
    /** @type {WebSocket} */
    #socket = null;
    connect() {
      UI.container.chat.sub.infoArea.sub.time.attr({ text: "Reconnecting..." });
      this.#socket = new WebSocket("ws://"+location.host);
      this.#socket.onmessage = event => {
        const response = JSON.parse(event.data);
        if (response.error)
          this.onerror(response.error);
        else if (response.type === "connection")
          this.onconnect(response.data);
        else
          this.onmessage(response.type, response.data);
      };
      this.#socket.onclose = event => {
        this.ondisconnect(event);
      };
    }
    send(data) {
      this.#socket.send(JSON.stringify(data));
    }
    disconnect() {
      this.#socket.close();
    }
    /** @type {<K extends keyof SocketResponse>(type:K,data:SocketResponse[K])=>this} */
    onmessage(type, data) {
      if (type == "message") {
        const message = Message.from(data.message);
        console.log(message)
        UI.list.chatItems.find((chatItem,index)=>{
          if(chatItem.id===message.chatId){
            /** @type {ChatItem} */
            const chatItem = UI.list.chatItems.get(index);
            chatItem.addMessage(message);
            return true;
          }
          return false;
        });
      }else if(type === "contact.update"){}
    }
    onconnect(data) {
      console.log("Socket connected: ", data);
      UI.container.chat.sub.infoArea.unmount();
    }
    ondisconnect(data) {
      console.log("Socket connection disconnected", data);
      App.connectionInfo("Unable to connect to the server, please check your internet connection.", () => {
        this.connect();
      });
    }
    onerror(error) {
      console.log(error);
      App.connectionInfo(error, () => {
        this.connect();
      });
    }
  };

  popupCount = 0;
  dataValidation = {
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    username: /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,50}$/
  };
  date = {
    /**
     * @param {Date|number} date
     * @param {boolean} keepTime Keep time for date more that a month
    */
    stringify(date, keepTime = false) {
      date = new Date(date);
      const date_now = new Date();
      let deltaDate = date_now - date;
      /** @type {Intl.DateTimeFormatOptions} */
      const options = {};
      // seconds
      deltaDate = Math.floor(deltaDate / 1000);
      options.second = "numeric";
      if (deltaDate < 60)
        return "just now";
      else if (deltaDate >= 60) {
        // minutes
        deltaDate = Math.floor(deltaDate / 60);
        options.minute = "2-digit";
        if (deltaDate >= 60) {
          delete options.second;
          // hours
          deltaDate = Math.floor(deltaDate / 60);
          options.hour = "2-digit";
          if (deltaDate >= 24) {
            // days
            deltaDate = Math.floor(deltaDate / 24);
            if (Math.floor(deltaDate / 7) < 1)
              options.weekday = "short";
            else {
              options.day = "numeric";
              options.month = "short";
              if (!keepTime) {
                delete options.hour;
                delete options.minute;
              }
              if (date.getFullYear() !== date_now.getFullYear())
                options.year = "numeric";
            }
          }
        }
      }
      return date.toLocaleString(navigator.language, options);
    },
    /** @param {Date|number} date*/
    format(date) {
      let deltaDate = Date.now() - date;
      deltaDate = Math.floor(deltaDate / 1000);
      if (deltaDate < 10)
        return "just now";
      else if (deltaDate <= 60)
        return deltaDate + " s";
      deltaDate = Math.floor(deltaDate / 60);
      if (deltaDate < 60)
        return deltaDate + " min";
      deltaDate = Math.floor(deltaDate / 60);
      if (deltaDate < 24)
        return deltaDate + " hr";
      deltaDate = Math.floor(deltaDate / 24);
      if (deltaDate < 28)
        return deltaDate + " d";
      return App.date.stringify(date);
    }
  };
  async populateFriendsList() {
    const skips = App.data.chats.size();
    App.request(`/chat?skips=${skips}`, {
      method: "GET"
    }).then(/** @param {ChatResponse[]} data */data => {
      // const profilePicturesUri = "/resources/profilePictures";
      console.log(data);
      data.forEach(chatResponse => {
        const chat = Chat.from(chatResponse);
        App.data.chats.add(chat.id, chat);
      });
    });
  }
  async fetchMessages(chatId, skips) {
    App.request(`/message/${chatId}?skips=${skips}`, {
      method: "GET"
    }).then(/** @param {ChatResponse[]} data */data => {
      data.forEach(messageResponse => {
        const message = Message.from(messageResponse);
        UI.list.chatItems.find((chatItem, index) => {
          if (chatItem.id === message.chatId) {
            /** @type {ChatItem} */
            const chatItem = UI.list.chatItems.get(index);
            chatItem.chatArea.addMessage(message, 0);
            return true;
          }
          return false;
        });
      });
    });
  }
  async auth() {
    App.request("/user/auth", {
      method: "GET"
    })
      .then(async user => {
        App.session.currentUser = User.from(user);
        App.session.currentUser.image = User.defaultImage;
        App.loadUser(App.session.currentUser);
        App.socket.connect();
      })
      .then(() => {
        App.populateFriendsList();
        UI.container.prompts.style({ display: "none" });
        UI.container.auth.unmount();
        UI.container.chat.mount(UI.container.main);
      })
      .catch((ex) => {
        console.log(ex)
        UI.container.chat.unmount();
        UI.container.auth.mount(UI.container.main);
      });
  }
  logout() {
    App.session.removeCurrentUser();
    App.socket.disconnect();
    window.location.reload();
  }
  /** @param {HTMLFormElement} form */
  async sendMessage(form) {
    const formData = new FormData(form);
    App.request(form.action, {
      method: form.method ?? "POST",
      body: new URLSearchParams(formData)
    }).then(data => {
      const message = Message.from(data);
      console.log(message);
      UI.list.chatItems.find((chatItem, index) => {
        if (chatItem.id === message.chatId) {
          /** @type {ChatItem} */
          const chatItem = UI.list.chatItems.get(index);
          console.log(chatItem)
          chatItem.addMessage(message);
        }
      });
    }).catch(ex => {
      let n = new UINotification("failed to send message <br/>" + ex, [], "error");
      n.mount(UI.container.notifications);
    });
  }

  /** @param {Component} chatArea */
  async receiveMessage(chatArea) {
    App.request("/message", {
      method: "GET",
      body: new URLSearchParams({ chatId: 20 })
    }).then(data => {
      // Message sent
    });
  }

  /**
   * Make a fetch request
   * @param {RequestInit} url
   * @param {RequestInfo} object
   * @returns {Promise<{}>}
   */
  request(url, object = null) {
    return new Promise(function (resolve, reject) {
      fetch(url, object).then(async response => {
        if (!response.ok) {
          const error = await response.text();
          reject(error);
          App.popAlert(error);
        } else
          resolve(await response.json());
      }).catch(ex => App.popAlert(ex));
    });
  }
  /** @param {User} user */
  loadUser(user) {
    UI.container.chat.sub.userDPHolder.sub.image.attr({
      src: user.image
    });
    UI.container.userProfile = new Profile(user);
    user.contacts.forEach(contact => {
      const listItem = new ContactItem(contact);
      UI.list.contacts.add(listItem);
    });
  }

  popAlert(...content) {
    const component = new UINotification(content.join("<br/>"));
    component.mount(UI.container.notifications);
  }
  popConfirm(title, content) {
    UI.container.prompts.style({ display: "initial" });
    const component = new Popup(title, content, [{
      type: "accept",
      value: "Accept",
      action(popup, event) {
        console.log(event);
      }
    }, { type: "cancel" }]);
    component.on("close", () => {
      this.popupCount--;
      if (this.popupCount <= 0)
        UI.container.prompts.style({ display: "none" });
    });
    component.mount(UI.container.prompts);
    this.popupCount++;
  }
  /**
   * @param {string} text
   * @param {()} action */
  connectionInfo(text, action = () => { }) {
    clearTimeout(this.#timeout);
    const { infoArea } = UI.container.chat.sub;
    infoArea.mount(UI.container.chat.sub.sideBar);
    infoArea.sub.content.attr({ text });
    infoArea.sub.button.event({ click: action });
    let seconds = 10;
    this.#timeout = setInterval(() => {
      infoArea.sub.time.attr({ text: "Retrying to connect in " + seconds + "s" });
      seconds--;
      if (seconds < 0) {
        clearTimeout(this.#timeout);
        action();
      }
    }, 1000);
  }
};

UI.onInit(ui => {

  const { container, list } = ui; // UI == ui

  const { loginForm, registerForm, formHolder } = container.auth.sub;
  const chatObserver = new IntersectionObserver(elements => {
    const lastChat = elements[0];
    if (!lastChat.isIntersecting) return;
    console.log(elements);
    App.populateFriendsList();
    // chatObserver.unobserve(lastChat.target);
  }, {
    rootMargin: "150px"
  });

  const unobserveLastChat = (chat) => {
    const observedChat = document.querySelector(".list-item:nth-last-child(2)");
    if (observedChat)
      chatObserver.unobserve(observedChat);
  }
  const observeLastChat = () => {
    const toBeObservedChat = document.querySelector(".list-item:last-child");
    chatObserver.observe(toBeObservedChat);
  }
  const messageObserver = new IntersectionObserver(elements => {
    const lastMessage = elements[0];
    if (!lastMessage.isIntersecting) return;
    const currentChatId = App.data.chats.getSelected();
    const messageCount = App.data.chats.get(currentChatId).messages.length;
    App.fetchMessages(currentChatId, messageCount);
    messageObserver.unobserve(lastMessage.target);
  }, {
    // rootMargin: "150px"
  });
  const unobserveLastMessage = () => {
    const observedMessage = document.querySelector(".message-container:nth-child(2)");
    if (observedMessage)
      messageObserver.unobserve(observedMessage);
  }
  const observeLastMessage = () => {
    const toBeObservedMessage = document.querySelector(".message-container");
    messageObserver.observe(toBeObservedMessage);
  }

  // Login Form events
  loginForm.event({
    reset(event) {
      event.preventDefault();
      // formHolder.removeAttr("active");
      registerForm.mount(formHolder);
      loginForm.unmount();
    },
    async submit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      event.target.elements.submit.disabled = true;
      const request = await fetch("/user/login", {
        method: "POST",
        body: new URLSearchParams(formData)
      }).catch(ex => App.popAlert("ERROR: ", ex));
      setTimeout(() => event.target.elements.submit.disabled = false, 1000);
      if (request) {
        if (request.ok) {
          // App.auth();
          const user = await request.json();
          App.session.currentUser = User.from(user);
          App.socket.connect();
          App.populateFriendsList();
          App.popAlert("Login successful!🙌");
          container.auth.unmount();
          container.chat.mount(UI.container.main);
        } else {
          App.popAlert(await request.text());
        }
      }
    }
  });

  // Register Form events
  registerForm.event({
    reset(event) {
      event.preventDefault();
      // formHolder.attr({active:"login"});
      loginForm.mount(formHolder);
      registerForm.unmount();
    },
    async submit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      if (!App.dataValidation.email.test(email)) {
        App.popAlert("Invalid email address")
        return;
      }
      if (!App.dataValidation.username.test(username)) {
        App.popAlert("Invalid username. Requirements: Minimum 4 characters, maximum 20 characters, numbers and letters are allowed, only special characters allowed are . (dot) and _ (underscore)")
        return;
      }
      if (App.dataValidation.password.test(password)) {
        if (password !== confirmPassword) {
          App.popAlert("Password does not match");
          return;
        }
      } else {
        App.popAlert("Invalid password. Requirements: Minimum 6 characters, maximum 50 characters, at least one letter, one number and one special character ( @ $ ! % * # ? & . _ )");
        return;
      }
      event.target.elements.submit.disabled = true;
      const request = await fetch("/user/register", {
        method: "POST",
        body: new URLSearchParams(formData)
      }).catch(ex => App.popAlert("Error: ", ex));
      event.target.elements.submit.disabled = false;
      if (request) {
        if (request.ok) {
          // App.auth();
          const user = await request.json();
          App.session.currentUser = User.from(user);
          App.socket.connect();
          App.populateFriendsList();
          App.popAlert("Registration successful!😍");
          container.auth.unmount();
          container.chat.mount(UI.container.main);
        } else {
          App.popAlert(await request.text());
        }
      }
    }
  });

  // Chat side-bar
  const { sideBar } = container.chat.sub;
  container.chat.sub.pinOption.event({
    click() {
      if (!sideBar.hasAttr("collapsed")) {
        sideBar.attr({ collapsed: true });
        container.chat.sub.pinOption.attr({ title: "Expand" });
      } else {
        sideBar.removeAttr("collapsed");
        container.chat.sub.pinOption.attr({ title: "Collapse" });
      }
    }
  });

  container.chat.sub.userDPHolder.event({
    click() {
      if (container.userProfile)
        container.userProfile.mount(container.main);
    }
  });

  const { actions, contactList, chatList, peopleSearchList } = container.chat.sub;


  actions.sub.findPeople.event({
    click() {
      if (contactList.mounted) {
        peopleSearchList.mountAfter(contactList);
        contactList.unmount();
      } else if (chatList.mounted) {
        peopleSearchList.mountAfter(chatList);
        chatList.unmount();
      }
    }
  });
  actions.sub.contacts.event({
    click() {
      if (contactList.mounted) {
        chatList.mountAfter(peopleSearchList.mounted ? peopleSearchList : contactList);
        peopleSearchList.unmount();
        contactList.unmount();
        DOM.attrNS(actions.sub.contacts.element.children[0].children[0], {
          "xlink:href": "#contacts"
        });
      } else {
        contactList.mountAfter(peopleSearchList.mounted ? peopleSearchList : chatList);
        peopleSearchList.unmount();
        chatList.unmount();
        DOM.attrNS(actions.sub.contacts.element.children[0].children[0], {
          "xlink:href": "#menu"
        });
      }
    }
  });
  actions.sub.settings.event({
    click() { }
  });

  chatList.sub.emptyArea.sub.startChat.event({
    click() {
      actions.sub.contacts.element.click();
    }
  });
  contactList.sub.emptyArea.sub.newContact.event({
    click() {
      actions.sub.findPeople.element.click();
    }
  });

  // Search Users Form events
  peopleSearchList.sub.searchBar.event({
    async submit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      // event.target.elements.submit.disabled = true;
      const request = await fetch("/user/search?query=" + formData.get("query"), {
        method: "GET"
      }).catch(ex => App.popAlert("ERROR: ", ex));
      if (request) {
        if (request.ok) {
          /** @type {UserResponse[]} */
          const responseData = await request.json();
          peopleSearched.clear();
          responseData.forEach(user => {
            peopleSearched.add(new ContactItem(User.from(user)));
          });
        } else
          App.popAlert(await request.text());
      }
    }
  });

  // Search Contacts Form events
  contactList.sub.searchBar.event({
    submit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const query = formData.get("query");
      contacts.clearFiltered();
      contacts.filter(item => item.mainText.innerText.includes(query));
    }
  });
  let oldValue = "";
  contactList.sub.searchBarInput.event({
    keyup(event) {
      if (event.target.value === oldValue)
        return;
      contacts.clearFiltered();
      contacts.filter(item => item.mainText.innerText.toLowerCase().includes(event.target.value.toLowerCase()));
      contacts.sort((a, b) => {
        return b.mainText.innerText.localeCompare(a.mainText.innerText, "en", {
          sensitivity: "base"
        });
      });
      oldValue = event.target.value;
    }
  });
  let c_oldValue = "";
  chatList.sub.searchBarInput.event({
    keyup(event) {
      if (event.target.value === c_oldValue)
        return;
      chatItems.clearFiltered();
      chatItems.filter(item => item.mainText.innerText.toLowerCase().includes(event.target.value.toLowerCase()));
      chatItems.sort((a, b) => {
        return parseInt(a.timeText.getAttribute("time")) - parseInt(b.timeText.getAttribute("time"))
      });
      c_oldValue = event.target.value;
    }
  });

  // demo code
  const menu = new UIMenu("chat");
  let itemCount = 0;
  menu.addItem("delete", "Remove Last Item", () => {
    if (itemCount > 0)
      menu.removeItem("item" + --itemCount);
  });
  menu.addItem("insert", "Add Item", () => {
    menu.addItem("item" + itemCount, "Item " + itemCount + " added", () => { });
    itemCount++;
  });
  // or
  menu.addItems([{
    name: "close",
    text: "Close",
    action() {
      menu.unmount();
    }
  }, {
    name: "delete",
    text: "Delete Menu",
    action() {
      menu.remove();
    }
  }]);

  container.chat.sub.messagesArea.event({
    /** @param {PointerEvent} event */
    contextmenu(event) {
      event.preventDefault();
      menu.mount(container.chat, event);
    }
  });

  /** @type {UIHandler.ComponentList<ChatItem>} */
  const chatItems = new UIHandler.ComponentList("chatItems", { selectMultiple: false });
  UI.addList(chatItems);
  /** @type {UIHandler.ComponentList<ContactItem>} */
  const contacts = new UIHandler.ComponentList("contacts");
  UI.addList(contacts);
  /** @type {UIHandler.ComponentList<ContactItem>} */
  const peopleSearched = new UIHandler.ComponentList("peopleSearched");
  UI.addList(peopleSearched);

  // ChatItem listeners
  chatItems.on("add", function (chatItem) {
    if (chatList.sub.emptyArea.mounted)
      chatList.sub.emptyArea.unmount();
    chatList.addChildren([chatItem]);
    unobserveLastChat();
    observeLastChat();
  });
  chatItems.on("remove", function (index, chatItem) {
    delete chatList.sub[chatItem.id];
    unobserveLastChat();
    observeLastChat();
    chatItem.unmount();
    if (chatItems.size === 0)
      chatList.sub.emptyArea.mount(chatList);
  });
  chatItems.on("update", function (index, item) {
    item.mountAfter(chatList.getChild(index + 1));
  });
  chatItems.on("unselect", function (index) {
    chatItems.get(index).chatArea.unmount();
    chatItems.get(index).removeAttr("active");
  });
  chatItems.on("select", function (index) {
    if (container.chat.sub.messagesArea.sub.emptyArea.mounted)
      container.chat.sub.messagesArea.sub.emptyArea.unmount();
    chatItems.get(index).chatArea.mount(container.chat.sub.messagesArea);
    unobserveLastMessage();
    observeLastMessage();
  });

  App.data.chats.on("add", function (chat) {
    chatItems.add(new ChatItem(chat));
  });
  App.data.chats.on("remove", function (id) {
    chatItems.remove(id);
  });
  App.data.chats.on("select", function (chat) {
    chatItems.has((chatItem, index) => {
      if (chatItem.id === chat.id) {
        chatItems.select(index);
        return true;
      }
    });
  });

  // UserItem listeners
  contacts.on("add", function (userItem, index) {
    if (contactList.sub.emptyArea.mounted)
      contactList.sub.emptyArea.unmount();
    contactList.addChildren([userItem]);
  });
  contacts.on("remove", function (index, userItem) {
    delete contactList.sub[userItem.id];
    userItem.unmount();
    if (contacts.size === 0)
      contactList.sub.emptyArea.mount(contactList);
  });
  contacts.on("update", function (index, item) {
    item.mountAfter(contactList.getChild(index + 1));
  });

  peopleSearched.on("add", function (userItem) {
    if (peopleSearchList.sub.emptyArea.mounted)
      peopleSearchList.sub.emptyArea.unmount();
    userItem.mount(peopleSearchList);
  });
  peopleSearched.on("remove", function (index, userItem) {
    userItem.unmount();
    console.log(peopleSearched.size);
    if (peopleSearched.size === 0)
      peopleSearchList.sub.emptyArea.mount(peopleSearchList);
  });

  // Populate db with dummy data
  // populate();
  // createChats();

});

window.addEventListener("load", async function () {

  await App.auth();
  // const data = generateData();
  UI.init();
});

function isTrue() {
  return randomInt(0, 1) === 0;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}