/// <reference path="dom.js"/>
/// <reference path="listener.js"/>

class UIHandler{
  #listener=new Listener();
  /**
   * All components are stored here
   * @type {Object<string,UIHandler.Component>} */
  #components={};
  /**
   * All 'container' type components are stored here and can be accessed by their corresponding id
   * @type {Object<string,UIHandler.Component>} */
  container={};
  init(){
    document.querySelectorAll("[c-id]").forEach(element=>{
      this.addComponent(element);
    });
    this.#listener.trigger(this);
  }
  /**
   * @param {initAction} action
   * @callback initAction
   * @param {UIHandler} interface
   */
  onInit(action){
    this.#listener.on(action);
  }
  /**
   * Store and manage element as a component
   * @param {HTMLElement} element */
  addComponent(element){
    const id=element.getAttribute("c-id");
    const type=element.getAttribute("c-type")??"container";
    const component=new UIHandler.Component(id,element);
  
    const parentComponentId=element.getAttribute("c-parent-id");
    // Checks if a component with parentComponentId is already present
    if(this.#components[parentComponentId])
      this.#components[parentComponentId].addSub(component);
    else if(type in this)
      this[type][id]=component;
    // else
      // this.type[type][id]=component;

    const unmount=element.getAttribute("c-unmount");
    if(unmount==="true")
      component.unmount();

    this.#components[id]=component;
    return element;
  }
};

UIHandler.Component=class Component{
  /**
   * Component's element
   * @type {HTMLElement} */
  element=null;
  /**
   * Component's parent component
   * @type {Component} */
  parent=null;
  /**
   * Consists of sub components. (usage eg. parentId.sub.childId)
   * @type {Object<string,UIHandler.Component>} */
  sub={};
  /**
   * @param {string} id Component's ID
   * @param {HTMLElement} element Component's element
   * @param {string} [type] Component's element
   */
  constructor(id,element,type){
    this.id=id;
    this.element=element;
    this.attr({cId:id,cType:type});
  }
  /**
   * Component's ID
   * @type {string} */
  id=null;
  /** Remove/delete element from component */
  remove(){
    if(this.element){
      this.element.remove();
      this.element=null;
      return true;
    }else{
      return false;
    }
  }
  /** Unmount element from HTML document */
  unmount(){
    if(this.element)
      this.element.remove();
  }
  /**
   * Inserts Component at the end of parent
   * @param {Component} parent */
  mount(parent){
    parent.element.appendChild(this.element);
  }
  /** Add multiple components as sub components
   * @param {UIHandler.Component[]} components */
  addChildren(components=[]){
    components.forEach(component=>{
      this.element.appendChild(component.element);
      this.addSub(component);
    });
    return this;
  }
  /**
   * Apply CSS style to component's element
   * @param {CSSStyleRule} styles*/
  style(styles){
    DOM.style(this.element,styles);
  }
  /** @param {Object<string,string>} properties*/
  styleProperties(properties){
    DOM.styleProp(this.element,properties);
  }
  /**
   * Set multiple attributes (usage eg. { class: "className", id: "element-id" })
   * @param {DOMAttributes} attributes*/
  attr(attributes){
    DOM.attr(this.element,attributes);
  }
  /** @param {string} attributes*/
  getAttr(attribute){
    return this.element.getAttribute(attribute);
  }
  /** @param {string} attributes*/
  removeAttr(attribute){
    return this.element.removeAttribute(attribute);
  }
  /**
   * @param {DOMEvents} events
   * @param {Object<string,AddEventListenerOptions>} options
   */
  event(events,options={}){
    DOM.event(this.element,events,options);
  }
  /** @param {Component} component */
  addSub(component){
    component.parentComponent=this;
    this.sub[component.id]=component;
  }
};

UIHandler.ComponentList=class ListComponent{
  #listener=new Listeners(["insert","delete","select","update"]);
  /** @type {Map<string,UIHandler.Component>} */
  #list=new Map();
  constructor(){}
  /**
   * Inserts a Component into the list
   * @param {UIHandler.Component} component */
  insert(component){
    this.#list.set(component.id,component);
    this.#listener.trigger("insert",component);
    return this;
  }
  /**
   * Deletes a Component into the list
   * @param {string} componentId */
  delete(componentId){
    if(this.#list.has(componentId)){
      this.#listener.trigger("delete",this.#list.get(componentId));
      this.#list.delete(componentId);
    }
    return this;
  }
  /**
   * Selects a Component components into the list
   * @param {string} componentId */
  select(componentId){
    if(this.#list.has(componentId)){
      this.#listener.trigger("select",this.#list.get(componentId));
    }
    return this;
  }
  /**
   * @callback listAction
   * @param {UIHandler.Component} component
   * @returns {void}
   * @param {"insert"|"delete"|"select"|"update"} eventName
   * @param {listAction} action
   */
  on(eventName,action){
    this.#listener.on(eventName,action);
  }
};

const components=new UIHandler.ComponentList();
components.on("insert",function(component){
  console.log("inserted",component.id);
});
components.on("delete",function(component){
  console.log("deleted",component.id);
});
[
  new UIHandler.Component("divOne",DOM.create("div",{text:"DIV 1"})),
  new UIHandler.Component("divTwo",DOM.create("div",{text:"DIV 2"})),
  new UIHandler.Component("divThree",DOM.create("div",{text:"DIV 3"}))
].forEach(component=>components.insert(component));

components.delete("divOne").delete("divTwo");