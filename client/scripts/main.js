/// <reference path="../../data/sample-users.js"/>
/// <reference path="../../data/sample-messages.js"/>
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
  session = new Session();  // session.js

  data = {
    /** @type {DataManager<Chat>} */
    chats: new DataManager()  // data-manager.js
  };

  socket = new class {
    /** @type {WebSocket} */
    #socket = null;
    connect() {
      this.#socket = new WebSocket("ws://localhost:3000");
      this.#socket.onmessage = event => {
        const response = JSON.parse(event.data);
        if (response.error)
          this.onerror(response.error);
        else if (response.type === "connection")
          this.onconnect(response.data);
        else
          this.onmessage(response.type, response.data);
      };
    }
    send(data) {
      this.#socket.send(JSON.stringify(data));
    }
    onmessage(type, data) {
      console.log(type, data);
    }
    onconnect(data) {
      console.log(data);
    }
    onerror(error) {
      console.log(error);
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
        return deltaDate+" s";
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
    App.request("/chat", {
      method: "GET"
    }).then(/** @param {ChatResponse[]} data */data => {
      // const profilePicturesUri = "/resources/profilePictures";
      data.forEach(chatResponse => {
        const chat=Chat.from(chatResponse);
        App.data.chats.insert(chat.id, chat);
      });
    });
  }
  async auth() {
    App.request("/user/auth", {
      method: "GET"
    }).then(async user => {
      App.session.currentUser = User.from(user);
      App.session.currentUser.image=User.defaultImage;
      App.loadUser(App.session.currentUser);
      UI.container.auth.unmount();
      UI.container.chat.mount(UI.container.main);
      App.populateFriendsList();
    }).catch(() => {
      UI.container.chat.unmount();
      UI.container.auth.mount(UI.container.main);
    });
  }
  logout() {
    App.session.removeCurrentUser();
    window.location.reload();
  }
  /** @param {HTMLFormElement} form */
  async sendMessage(form) {
    const formData = new FormData(form);
    App.request(form.action, {
      method: form.method ?? "POST",
      body: new URLSearchParams(formData)
    }).then(data => {
      const message=Message.from(data);
      console.log(message);
      if(UI.list.chatItems.has(message.chatId)){
        /** @type {ChatItem} */
        const chatItem=UI.list.chatItems.get(message.chatId);
        console.log(chatItem)
        chatItem.addMessage(message);
      }
    }).catch(ex => {
      let n = new UINotification("failed to send message <br/>"+ex, [], "error");
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
  loadUser(user){
    UI.container.chat.sub.userDPHolder.sub.image.attr({
      src:user.image
    });
    UI.container.userProfile=new Profile(user);
    user.contacts.forEach(contact=>{
      const listItem=new UserItem(contact);
      UI.list.contacts.insert(listItem);
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
};

UI.onInit(ui => {

  const { container, list } = ui; // UI == ui

  const { loginForm, registerForm, formHolder } = container.auth.sub;

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
          App.session.currentUser = User.from(await request.json());
          App.popAlert("Login successful!🙌");
          container.auth.unmount();
          container.chat.mount(UI.container.main);
          App.populateFriendsList();
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
          App.session.currentUser = User.from(await request.json());
          App.popAlert("Registration successful!😍");
          container.auth.unmount();
          container.chat.mount(UI.container.main);
          App.populateFriendsList();
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
    click(){
      if(container.userProfile)
        container.userProfile.mount(container.main);
    }
  });

  const {actions,contactList,chatList,peopleSearchList}=container.chat.sub;
  actions.sub.findPeople.event({
    click(){
      if(contactList.mounted){
        peopleSearchList.mountAfter(contactList);
        contactList.unmount();
      }else if(chatList.mounted){
        peopleSearchList.mountAfter(chatList);
        chatList.unmount();
      }
    }
  });
  actions.sub.contacts.event({
    click(){
      if(contactList.mounted){
        chatList.mountAfter(peopleSearchList.mounted?peopleSearchList:contactList);
        peopleSearchList.unmount();
        contactList.unmount();
        DOM.attrNS(actions.sub.contacts.element.children[0].children[0],{
          "xlink:href":"#contacts"
        });
      }else{
        contactList.mountAfter(peopleSearchList.mounted?peopleSearchList:chatList);
        peopleSearchList.unmount();
        chatList.unmount();
        DOM.attrNS(actions.sub.contacts.element.children[0].children[0],{
          "xlink:href":"#menu"
        });
      }
    }
  });
  actions.sub.settings.event({
    click(){}
  });

  chatList.sub.emptyArea.sub.startChat.event({
    click(){
      actions.sub.contacts.element.click();
    }
  });
  contactList.sub.emptyArea.sub.newContact.event({
    click(){
      actions.sub.findPeople.element.click();
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
  const chatItems = new UIHandler.ComponentList("chatItems");
  UI.addList(chatItems);
  /** @type {UIHandler.ComponentList<UserItem>} */
  const contacts = new UIHandler.ComponentList("contacts");
  UI.addList(contacts);
  /** @type {UIHandler.ComponentList<UserItem>} */
  const peopleSearched = new UIHandler.ComponentList("peopleSearched");
  UI.addList(peopleSearched);

  // ChatItem listeners
  chatItems.on("insert", function (chatItem) {
    if (container.chat.sub.chatList.sub.emptyArea.mounted)
      container.chat.sub.chatList.sub.emptyArea.unmount();
    chatItem.mount(container.chat.sub.chatList);
  });
  chatItems.on("delete", function (chatItem) {
    chatItem.remove();
  });
  chatItems.on("deselect", function (chatItem) {
    chatItem.chatArea.unmount();
  });
  chatItems.on("select", function (chatItem) {
    if (container.chat.sub.messagesArea.sub.emptyArea.mounted)
      container.chat.sub.messagesArea.sub.emptyArea.unmount();
    chatItem.chatArea.mount(container.chat.sub.messagesArea);
  });

  App.data.chats.on("insert", function (chat) {
    chatItems.insert(new ChatItem(chat));
  });
  App.data.chats.on("delete", function (chat) {
    chatItems.delete(chat.id);
  });
  App.data.chats.on("select", function (chat) {
    chatItems.select(chat.id);
  });

  // UserItem listeners
  contacts.on("insert",function(userItem){
    if(contactList.sub.emptyArea.mounted)
      contactList.sub.emptyArea.unmount();
    userItem.mount(contactList);
  });
  contacts.on("delete",function(userItem){
    userItem.unmount();
    console.log(contacts.size);
    if(contacts.size===0)
      contactList.sub.emptyArea.mount(contactList);
  });
  peopleSearched.on("insert",function(userItem){
    if(peopleSearchList.sub.emptyArea.mounted)
      peopleSearchList.sub.emptyArea.unmount();
    userItem.mount(peopleSearchList);
  });
  peopleSearched.on("delete",function(userItem){
    userItem.unmount();
    console.log(peopleSearched.size);
    if(peopleSearched.size===0)
      peopleSearchList.sub.emptyArea.mount(peopleSearchList);
  });

  const data=generateData();

  App.session.currentUser.chats.forEach(id=>{
    App.data.chats.insert(id,data.chats[id]);
  });
  App.loadUser(App.session.currentUser);

  container.prompts.style({ display: "none" });
});

window.addEventListener("load", function () {
  UI.init();
  App.auth();
});

function generateData() {
  /** @type {Object<string,User>} */
  const users={};
  /** @type {Object<string,Chat>} */
  const chats={};
  sample_users.forEach((sample_user,index)=>{
    sample_user._id=sample_user._id.$oid;
    sample_user.lastSeen=sample_user.lastSeen.$date;
    const user=User.from(sample_user);
    user.username=user.name.toLowerCase().replaceAll(" ",".");
    users[user.id]=user;
    sample_users[index]=user;
    return user;
  });
  const usersKeys=Object.keys(users).slice(0,10);
  App.session.currentUser=users[usersKeys[0]];
  usersKeys.forEach(id=>{
    usersKeys.forEach(uid=>{
      const user=users[uid];
      if(users[id]!==user && isTrue() && !user.contacts.find(contact=>contact.id===id)){
        // users[id].contacts.push(new Contact(user));
        users[user.id].contacts.push(new Contact(users[id],user.lastseen));
        const chat=new Chat(id+user.id,[users[id],user],[]);
        chat.createdAt=user.lastseen;
        chats[chat.id]=chat;
        users[id].chats.push(chat.id);
      }
    });
  });
  const chatsArray=Object.keys(chats);
  const perChat=Math.floor(sample_messages.length/chatsArray.length);
  console.log(sample_messages.length,chatsArray.length,perChat);
  chatsArray.forEach((id,index)=>{
    for(let i=perChat*index;i<perChat*(index+1);i++){
      const message=sample_messages[i];
      message._id=message._id.$oid;
      message.createdAt=message.createdAt.$date;
      message.chat=id;
      message.sender=chats[id].participants[randomInt(0,1)].id;
      chats[id].messages.push(Message.from(message));
    }
    chats[id].messages.sort((a,b)=>a.createdAt-b.createdAt);
  });
  return {chats,users};
}

function isTrue(){
  return randomInt(0,1)===0;
}
function randomInt(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}