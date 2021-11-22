/// <reference path="types.d.ts"/>

class User {
  /** @type {string} */
  email = null;
  /** @type {string} */
  image = "resources/illustrations/male_avatar.svg";
  /** @type {Date|number} */
  lastseen = null;
  /** @type {0|1|2} */
  gender=0;
  /** @type {Contact[]} */
  contacts = [];
  /** @type {{userId:string,since:Date}[]} */
  requests = [];
  /** @type {{userId:string,since:Date}[]} */
  blocked = [];
  /** @type {string[]} */
  chats = [];
  /**
   * @param {string} id
   * @param {string} username
   * @param {string} name
   */
  constructor (id, username, name) {
    this.id = id;
    this.username = username;
    this.name = name;
  }
  /** @param {UserResponse} userResponse */
  static from(userResponse) {
    const { _id, username, name, contacts } = userResponse;
    const user = new User(_id, username, name);
    user.email = userResponse.email ?? null;
    user.gender = userResponse.gender ?? 0;
    user.image = userResponse.image ?? (App.session.isCurrentUserId(user.id)
      ? User.defaultImage : (user.gender<1
        ? "resources/illustrations/male_avatar.svg" :
        "resources/illustrations/female_avatar.svg"
      ));
    user.lastseen = userResponse.lastSeen ?? null;
    user.contacts = contacts instanceof Array ?
      contacts.map(contact=>Contact.from(contact)) :
      [];
    user.requests = userResponse.requests ?? [];
    user.blocked = userResponse.blocked ?? [];
    user.chats = userResponse.chats ?? [];
    return user;
  }
  static get defaultImage(){
    return "resources/illustrations/profile_pic.svg";
  }
};

class Contact extends User{
  /** @param {User} user */
  constructor(user,since=Date.now()){
    super(user.id,user.username,user.name);
    this.lastseen=user.lastseen;
    this.since=since;
    this.gender=user.gender;
    this.image=user.image;
  }
  /** @param {ContactResponse} contactResponse */
  static from(contactResponse){
    return new Contact(User.from(contactResponse.user),contactResponse.since);
  }
}