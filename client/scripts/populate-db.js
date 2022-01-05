/// <reference path="../data/sample-users.js"/>
/// <reference path="../data/sample-messages.js"/>
async function populate() {
  const data = generateData();
  for (user in data.users) {
    let userData = { ...(data.users[user]) }
    try {
      const response = await fetch('/user/register', {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
      if (response && response.ok) {
        console.log("User inserted");
      }
      else {
        console.log("User not inserted");
        console.log((await response.json()).message)
      }
    }
    catch (ex) { console.log(ex) };
  }

}
async function createChats() {
  let allUsers;
  try {
    const response = await fetch('/user/', {
      method: "GET"
    });
    if (response) {
      if (response.ok) {
        allUsers = (await response.json()).users;
      }
      else {
        console.log("No userr found");
        console.log((await response.json()).message);
        return;
      }
    }
    console.log(allUsers);
    for (let i = 0; i <= 10; i++) {
      let participant = allUsers[Math.floor(Math.random() * allUsers.length)];
      const response = await fetch('/chat/create', {
        method: "POST",
        body: JSON.stringify({
          participants: [participant]
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      if (response) {
        if (response.ok) {
          console.log("Chat created");
          const chatId = (await response.json())._id;
          for (let i = 1; i <= Math.floor(Math.random() * 15) + 1; i++)
            await createMessages(chatId);
        }
        else {
          console.log("Unable to create chat");
          console.log((await response.json()).message);
          return;
        }
      }
    }
  }
  catch (ex) { console.log(ex) };
}

async function createMessages(chatId) {
  try {
    const response = await fetch(`/message/${chatId}`, {
      method: "POST",
      body: JSON.stringify({
        "content": sample_messages[Math.floor(Math.random() * sample_messages.length)].content
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    if (response) {
      if (response.ok) {
        console.log("Message created");
      }
      else {
        console.log("Unable to create message");
        console.log((await response.json()).message);
        return;
      }
    }
  }
  catch (ex) { console.log(ex) };
}

function generateData() {
  /** @type {Object<string,User>} */
  const users = {};
  /** @type {Object<string,Chat>} */
  const chats = {};
  sample_users.forEach((sample_user, index) => {
    sample_user._id = sample_user._id.$oid;
    sample_user.lastSeen = sample_user.lastSeen.$date;
    const user = User.from(sample_user);
    user.username = user.name.toLowerCase().replaceAll(" ", ".");
    user.password = "#qwerty123"
    user.confirmPassword = "#qwerty123"
    users[user.id] = user;
    sample_users[index] = user;
    return user;
  });
  const usersKeys = Object.keys(users).slice(0, 10);
  App.session.currentUser = users[usersKeys[0]];
  usersKeys.forEach(id => {
    usersKeys.forEach(uid => {
      const user = users[uid];
      if (users[id] !== user && isTrue() && !user.contacts.find(contact => contact.id === id)) {
        // users[id].contacts.push(new Contact(user));
        users[user.id].contacts.push(new Contact(users[id], user.lastseen));
        const chat = new Chat(id + user.id, [users[id], user], []);
        chat.createdAt = user.lastseen;
        chats[chat.id] = chat;
        users[id].chats.push(chat.id);
      }
    });
  });
  const chatsArray = Object.keys(chats);
  const perChat = Math.floor(sample_messages.length / chatsArray.length);
  chatsArray.forEach((id, index) => {
    for (let i = perChat * index; i < perChat * (index + 1); i++) {
      const message = sample_messages[i];
      message._id = message._id.$oid;
      message.createdAt = message.createdAt.$date;
      message.chat = id;
      message.sender = chats[id].participants[randomInt(0, 1)].id;
      chats[id].messages.push(Message.from(message));
    }
    chats[id].messages.sort((a, b) => a.createdAt - b.createdAt);
  });
  return { chats, users };
}