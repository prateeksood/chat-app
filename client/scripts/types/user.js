/// <reference path="types.d.ts"/>

class User {
  /** @type {string} */
  email = null;
  /** @type {string} */
  image = null;
  /** @type {string} */
  lastseen = null;
  /** @type {{userId:string,since:Date}[]} */
  contacts = [];
  /** @type {{userId:string,since:Date}[]} */
  requests = [];
  /** @type {{userId:string,since:Date}[]} */
  blocked = [];
  /**
   * @param {string} _id
   * @param {string} username
   * @param {string} name
   */
  constructor (_id, username, name) {
    this._id = _id;
    this.username = username;
    this.name = name;
  }
  /** @param {UserResponse} userResponse */
  static from(userResponse) {
    const { _id, username, name } = userResponse;
    const user = new User(_id, username, name);
    user.email = userResponse.email ?? null;
    user.image = userResponse.image ?? null;
    user.lastseen = userResponse.lastseen ?? null;
    user.contacts = userResponse.contacts ?? [];
    user.requests = userResponse.requests ?? [];
    user.blocked = userResponse.blocked ?? [];
    return user;
  }
};