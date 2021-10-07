/// <reference path="listener.js"/>

class UIHandler{
  #listener=new Listener();
  /** @type {Object<string,UIHandler.Component>} */
  #components={};
  /** @type {Object<string,UIHandler.Component>} */
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
  /** @param {HTMLElement} element */
  addComponent(element){
    const id=element.getAttribute("c-id");
    const type=element.getAttribute("c-type");
    const component=new UIHandler.Component(id,element);
    const parentComponentId=element.getAttribute("c-parent-id");
    if(this.#components[parentComponentId])
      this.#components[parentComponentId].addSub(component);
    else if(type in this)
      this[type][id]=component;
    // else
      // this.type[type][id]=component;
    this.#components[id]=component;
    return element;
  }
};

UIHandler.Component=class Component{
  /** @type {HTMLElement} */
  element=null;
  /** @type {Component} */
  parent=null;
  /** @type {Object<string,UIHandler.Component>} */
  sub={};
  /**
   * @param {string} id
   * @param {HTMLElement} element
   */
  constructor(id,element){
    this.id=id;
    this.element=element;
  }
  /** @param {string} itemId*/
  id=null;
  remove(){
    if(this.element){
      this.element.remove();
      this.element=null;
      return true;
    }else{
      return false;
    }
  }
  unmount(){
    if(this.element)
      this.element.remove();
  }
  /**
   * Inserts Component at the end of parent
   * @param {Component} parent
   */
  mount(parent){
    parent.element.appendChild(this.element);
  }/** @param {UIHandler.Component[]} components */
  addChildren(components=[]){
    components.forEach(component=>{
      this.element.appendChild(component.element);
      this.addSub(component);
    });
    return this;
  }
  /** @param {CSSStyleRule} styles*/
  style(styles){
    DOM.style(this.element,styles);
  }
  /** @param {Object<string,string>} properties*/
  styleProperties(properties){
    DOM.styleProp(this.element,properties);
  }
  /** @param {object} attributes*/
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