
class Session{
  /**@type {{name:string,email:string,username:string}} */
  #currentUser=null;
  /**
   * Returns id of currently logged in user
   * @returns {string}
   */
  static currentUserID(){
      return localStorage.getItem("token");
  }
  /**
   * 
   * @param {{name:string,email:string,username:string}} user 
   */
  setCurrentUser(user){
    this.#currentUser=user;
  }
  /**
   * Sets currently logged in user to null
   */
   removeCurrentUser(){
    this.#currentUser=null;
  }

  /**
   * returns currently logged in user details
   * @returns {{name:string,email:string,username:string}}
   */
  getCurrentUser(){
    return this.#currentUser;
  }
}