/// <reference path="listener.js"/>

/** @template DataType */
class DataManager{
  #listener=new Listeners(["insert","delete","select","update","filter"]);
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
   * @param {"insert"|"delete"|"select"|"update"|"filter"} eventName
   * @param {dataAction} action
   */
  on(eventName,action){
    this.#listener.on(eventName,action);
  }
  /** @param {<>(data:DataType,dataId:string) Boolean} action */
  filter(action){
    const array=[];
    for(let [id,data] of this.#list){
      if(action(data,id)){
        array.push(data);
      }
    }
    this.#listener.trigger("filter",array);
  }
  /** @param {<>(data:DataType,dataId:string) Boolean} action */
  find(action){
    for(let [id,data] of this.#list){
      if(action(data,id))
        return data;
    }
    return false;
  }
}

/** @template DataType */
class DataList{
  /** @type {DataType[]} */
  #list=[];
  /** @type {number[]} */
  #selection=[];
  #autoSelect=false;
  #listener=new Listeners(["add","remove","select"]);
  constructor(){}
  /**
   * @param {DataType} item
   * @param {number} index
   */
  add(item,index){
    if(index<0)
      index=this.#list.push(item);
    else
      this.#list.splice(index,0,item);
    this.#listener.trigger("add",item,index);
    if(this.#autoSelect)
      this.select(index);
    return this;
  }
  /**
   * @param {number} index
   */
  select(index){
    if(index<this.#list.length)
      this.#selection.push(index);
    this.#listener.trigger("select",index);
  }
  on(type,action){
    this.#listener.on(type,action);
  }
}

/** @type {DataList<String>} */
const myList=new DataList();
myList.add("a").add("b").add("c").add("d");
myList.on("select",function(item,index){
  console.log("Item [%d] selected: ",index,item);
});