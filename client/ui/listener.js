class Listener{
  /** @type {{type:"on"|"once",action:action}[]} */
  #actions=[];
  on(action){
    this.#actions.push({action,type:"on"});
  }
  once(action){
    this.#actions.push({action,type:"once"});
  }
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