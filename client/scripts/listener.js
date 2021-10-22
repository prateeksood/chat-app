/**
 * Listen for triggers and call actions */
class Listener{
  /** @type {{type:"on"|"once",action:action}[]} */
  #actions=[];
  /**
   * store action that needs to be called on trigger
   * @param {function} action
   */
  on(action){
    this.#actions.push({action,type:"on"});
  }
  /**
   * store action that needs to be called only once on trigger.
   * @param {function} action
   */
  once(action){
    this.#actions.push({action,type:"once"});
  }
  /**
   * remove a stored action
   * @param {function} action
   */
  off(action){
    const index=this.#actions.findIndex(stored=>stored.action===action);
    if(index>=0){
      this.#actions.splice(index,1);
    }
  }
  /**
   * triggers stored actions and pass values into those actions
   */
  trigger(...value){
    let index=0;
    while(index<this.#actions.length){
      this.#actions[index].action(...value);
      if(this.#actions[index].type==="once"){
        this.#actions.splice(index,1);
        continue;
      }
      index++;
    }
  }
};

/**
 * Listen for multiple triggers and call actions
 * @callback action
 * @param {event} response
*/
class Listeners{
  /**
   * @type {Object.<string,{id:string,actions:{type:"on"|"once",action:action}[]}>}
  */
  #listeners={};
  /** @param {string[]} eventsNames */
  constructor(eventsNames=[]){
    eventsNames.forEach(eventName=>this.add(eventName));
  }
  add(eventName){
    this.#listeners[eventName]={
      id:eventName,
      actions:[]
    };
  }
  /**
   * @param {string} eventName 
   * @param {action} action 
   */
  on(eventName,action){
    if(!this.#listeners[eventName]){
      throw Error("ERR_INVALID_EVENT: '"+eventName+"' is not added as a listener");
    }
    this.#listeners[eventName].actions.push({action,type:"on"});
  }
  /**
   * @param {string} eventName 
   * @param {action} action 
   */
  once(eventName,action){
    this.#listeners[eventName].actions.push({action,type:"once"});
  }
  /**
   * @param {string} eventName
   */
  trigger(eventName,...response){
    if(this.#listeners[eventName]){
      let index=0;
      while(index<this.#listeners[eventName].actions.length){
        this.#listeners[eventName].actions[index].action(...response);
        if(this.#listeners[eventName].actions[index].type==="once"){
          this.#listeners[eventName].actions.splice(index,1);
          continue;
        }
        index++;
      }
    }
  }
};