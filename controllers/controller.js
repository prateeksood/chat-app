// Just testing something

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

class Controller{
  /**
   * @typedef {Object.<string,<>(request:Request, response:Response, next:NextFunction)>} obj
   * @typedef {<K extends obj>(k:K)K} x
   * @param {K} object
   */
  constructor(object){
    Object.keys(object).forEach(key=>this[key]=object[key]);
    this.x=object;
  }
}

const c=new Controller({
  async getChats(request,response,next){
    return;
  }
});
c.x()

module.exports=Controller;