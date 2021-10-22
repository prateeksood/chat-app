/** @template DataType */
class DataManager{
  #listener=new Listeners(["insert","delete","select","update"]);
  /** @type {Map<string,DataType>} */
  #list=new Map();
  constructor(){}
  /**
   * Check for data
   * @param {string} dataId */
  has(dataId){
    return this.#list.has(dataId);
  }
  /**
   * Get data
   * @param {string} dataId */
  get(dataId){
    return this.#list.get(dataId);
  }
  /**
   * Inserts data
   * @param {string} dataId An unique ID for data
   * @param {DataType} data */
  insert(dataId,data){
    this.#list.set(dataId,data);
    this.#listener.trigger("insert",data);
    return this;
  }
  /**
   * Deletes data
   * @param {string} dataId */
  delete(dataId){
    if(this.#list.has(dataId)){
      this.#listener.trigger("delete",this.#list.get(dataId));
      this.#list.delete(dataId);
    }
    return this;
  }
  /**
   * Selects stored data by it's ID
   * @param {string} dataId */
  select(dataId){
    if(this.#list.has(dataId)){
      this.#listener.trigger("select",this.#list.get(dataId));
    }
    return this;
  }
  /**
   * @callback dataAction
   * @param {DataType} data
   * @returns {void}
   * @param {"insert"|"delete"|"select"|"update"} eventName
   * @param {dataAction} action
   */
  on(eventName,action){
    this.#listener.on(eventName,action);
  }
};