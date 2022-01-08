/// <reference path="dom.js"/>
/// <reference path="listener.js"/>

class UIHandler{
  #listener=new Listener();
  /** All components are stored here
   * @type {Object<string,UIHandler.Component>} */
  #components={};
  /** All 'container' type components are stored here and can be accessed by their corresponding id
   * @type {Object<string,UIHandler.Component>} */
  container={};
  /** All 'container' type components are stored here and can be accessed by their corresponding id
   * @type {Object<string,UIHandler.ComponentList<UIHandler.Component>} */
  list={};
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
  /**
   * Store and manage a component
   * @param {UIHandler.Component} component */
  _addComponent(component){
    if("container" in this)
      this["container"][component.id]=component;
    this.#components[component.id]=component;
    return component;
  }
  /** @param {UIHandler.ComponentList} list */
  addList(list){
    if(list instanceof UIHandler.ComponentList)
      this.list[list.id]=list;
  }
};

/** @template ElementType */
UIHandler.Component=class Component{
  /**
   * Component's ID
   * @type {string} */
  id=null;
  /**
   * Component's element
   * @type {ElementType} */
  element=null;
  /**
   * Component's parent component
   * @type {Component} */
  parentComponent=null;
  /** Whether the component is mounted or not */
  mounted=false;
  /**
   * Consists of sub components. (usage eg. parentId.sub.childId)
   * @type {Object<string,UIHandler.Component>} */
  sub={};
  /**
   * @param {string} id Component's ID
   * @param {ElementType} element Component's element
   * @param {string} [type] Component's element
   */
  constructor(id,element,type){
    this.id=id;
    this.element=element;
    this.attr({cId:id,cType:type});
    if(element.parentElement)
      this.mounted=true;
  }
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
    this.mounted=false;
  }
  /**
   * Inserts Component at the end of parent
   * @param {Component} parent */
  mount(parent){
    if(!parent && this.parentComponent && this.parentComponent.element)
      this.parentComponent.element.appendChild(this.element);
    else
      parent.element.appendChild(this.element);
    this.mounted=true;
  }
  /**
   * Inserts Component after the Component's element
   * @param {Component} component */
  mountAfter(component){
    component.element.after(this.element);
    this.mounted=true;
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
  /** @param {string} attribute */
  getAttr(attribute){
    return this.element.getAttribute(attribute);
  }
  /** @param {string} attribute */
  hasAttr(attribute){
    return this.element.hasAttribute(attribute);
  }
  /** @param {string} attribute */
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

/**
 * @template T
 * @extends DataList<T>
 * */
UIHandler.ComponentList=class ComponentList extends DataList{
  /** @param {string} listId An identification string for list */
  constructor(listId=""){
    super();
    this.id=listId;
  }
};