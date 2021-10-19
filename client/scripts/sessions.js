/// <reference path="types/types.d.ts"/>
/// <reference path="types/user.js"/>

class Session {
  /**@type {User} */
  #currentUser = null;
  /** Returns id of currently logged in user */
  static currentUserID() {
    return localStorage.getItem("token");
  }
  /** Returns currently logged in user */
  get currentUser() {
    return this.#currentUser;
  }
  /** @param {User} user */
  set currentUser(user) {
    if (user instanceof User)
      this.#currentUser = user;
  }
  /** Sets currently logged in user to null */
  removeCurrentUser() {
    this.#currentUser = null;
  }
  /** @param {string} id */
  isCurrentUserId(id) {
    if (this.#currentUser)
      return id === this.#currentUser._id;
    return false
  }
}