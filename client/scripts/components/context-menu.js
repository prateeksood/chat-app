/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

class UIMenu extends UIHandler.Component{
  static #gap_at_end=16;
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
   * @param {string} name Name/ID for the item
   * @param {string} text Content of the Item
   * @param {menuItemAction} action A callback for click event
   */
  addItem(name,text,action){
    this.element.appendChild(DOM.create("li",{text,name},{/** No CSS style */},{click:action}));
  }
  /** @param {{name:string,text:string,action:menuItemAction}[]} items */
  addItems(items=[]){
    items.forEach(({name,text,action})=>{
      this.element.appendChild(DOM.create("li",{text,name},{/** No CSS style */},{click:action}));
    });
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
  /** Inserts Component at the end of parent
   * @param {UIHandler.Component} parent
   * @param {PointerEvent} event
   */
  mount(parent,event){
    super.mount(parent);
    /** Preventing this.element from displaying outside the parent.element */
    const width_diff=parent.element.clientWidth-this.element.clientWidth-UIMenu.#gap_at_end;
    const height_diff=parent.element.clientHeight-this.element.clientHeight-UIMenu.#gap_at_end;
    this.style({
      top:(event.y<height_diff?event.y:height_diff)+"px",
      left:(event.x<width_diff?event.x:width_diff)+"px"
    });
  }
};