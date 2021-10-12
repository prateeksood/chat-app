/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

class UIMenu extends UIHandler.Component{
  constructor(id=""){
    const element=DOM.create("menu",{class:"context-menu"});
    super("menu"+id,element);
    /** Unmount element when clicked outside of it */
    window.addEventListener("click",event=>this.#clickOutside(event));
  }
  /** @param {MouseEvent} event */
  #clickOutside(event){
    if(!event.path.includes(this.element)){
      this.unmount();
      window.removeEventListener("click",event=>this.#clickOutside(event));
    }
  }
  /**
   * Add a list item to the menu
   * @callback menuItemAction
   * @param {MouseEvent} event
   * @returns
   * @param {string} name
   * @param {string} text
   * @param {menuItemAction} action
   */
  addItem(name,text,action){
    this.element.appendChild(DOM.create("li",{text,name},{/** No CSS style */},{click:action}));
  }
  /**
   * Add a list item to the menu
   * @param {string} name
   */
  removeItem(name){
    this.element.children.namedItem(name)?.remove();
  }
  clearItems(){
    for(const child of this.element.children)
      child.remove();
  }
};