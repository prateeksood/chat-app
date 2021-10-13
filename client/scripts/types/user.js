/// <reference path="types.d.ts"/>

class User{
  /**
   * @param {string} id
   * @param {string} username
   * @param {string} name
   */
  constructor(id,username,name){
    this.id=id;
    this.username=username;
    this.name=name;
  }
  /** @param {UserResponse} userResponse */
  static from(userResponse){
    const {_id,userID,name}=userResponse;
    const user=new User(_id,userName,name);
  }
};