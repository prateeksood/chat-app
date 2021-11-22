/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="profile.js"/>
/// <reference path="../types/types.d.ts"/>
/// <reference path="../types/user.js"/>

class UserItem extends ListItem {
  /** @type {Profile} */
  profile = null;
  /** @param {User} user */
  constructor (user) {
    super(user.id, user.image, user.name, user.username, user.lastseen, {
      click:()=>{
        this.profile.mount(UI.container.main);
      }
    });
    this.profile = new Profile(user);
  }
}