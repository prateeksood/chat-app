/**
 * @typedef {Object<string,string|number|boolean>} DOMAttributes
 * @typedef {{[key in keyof HTMLElementEventMap]:EventListener}} DOMEvents
 */

const DOM=new class DOM{
	/**
   * Sets the attributes
   * @param {Element} element
   * @param {HTMLElementA} attributesData
   * @param {boolean} modify
   */
	attr(element,attributesData={},modify=true){
    for(let key in attributesData){
      if(typeof(key)==="string"){
        if(key==="class")
          element.className=attributesData[key];
        else if(key==="text")
          element.innerText=attributesData[key];
        else if(key==="html")
          element.innerHTML=attributesData[key];
        else if(key==="children"){
          attributesData[key].forEach(child=>{
            if(child instanceof Element)
              element.appendChild(child);
          });
        }else{
          element.setAttribute(modify===true?key.replace(/(\B[A-Z])/g,"-$1").toLowerCase():key,attributesData[key]);
        }
      }
    }
	}
  /**
   * @param {Element} element
   * @param {DOMAttributes} attributesData
   */
  attrNS(element,attributes={}){
    Object.entries(attributes).forEach(function(attribute){
      if(attribute[0]==="children"){
        attribute[1].forEach(function(child){
          element.appendChild(child);
        });
      }else{
        element.setAttributeNS(
          attribute[0].includes("xlink")?"http://www.w3.org/1999/xlink":null,
          attribute[0].includes("xlink:href")?"href":attribute[0],
          attribute[1]
        );
      }
    });
  }
  /** @param {string} className */
  class(className){
    return document.getElementsByClassName(className);
  }
  /**
   * Creates a new HTML Element
   * @type {<tagName extends keyof HTMLElementTagNameMap>(tagName:tagName)}
   * @param {DOMAttributes} attributes
   * @param {CSSStyleDeclaration} styles
   * @param {DOMEvents} events
   * @param {{modifyAttributes:true,modifyStyles:true}} options
   * @returns {HTMLElementTagNameMap[tagName]}
   */
  create(tagName,attributes={},styles={},events={},options={}){
    const element=document.createElement(tagName);
    this.attr(element,attributes,options.modifyAttributes??true);
    this.style(element,styles,options.modifyStyles??true);
    this.event(element,events);
    return element;
  }
  /**
   * Creates a new HTML NameSpace Element
   * @type {<qualifiedName extends keyof SVGElementTagNameMap>(qualifiedName:qualifiedName)}
   * @param {DOMAttributes} attributes
   * @param {{namespaceURI:"http://www.w3.org/2000/svg"}} options
   * @returns {SVGElementTagNameMap[qualifiedName]}
   */
  createNS(qualifiedName,attributes,options={}){
    let elm=document.createElementNS(options.namespaceURI??"http://www.w3.org/2000/svg",qualifiedName);
    this.attrNS(elm,attributes);
    return elm;
  }
  /**
   * Add event listeners to the element
   * @param {Element} element
   * @param {DOMEvents} eventsData
   * @param {Object<string,AddEventListenerOptions>} options
   */
  event(element,eventsData={},options={}){
    for(let key in eventsData){
      if(typeof(key)==="string"){
        element.addEventListener(key.toLowerCase(),eventsData[key],options[key]?options[key]:{});
      }
    }
  }
  /** @param {string} id */
  id(id){
    return document.getElementById(id);
  }
  /**
   * Applies styles to an element
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} stylesData
   */
   style(element,styleData={},modify=true){
    for(let key in styleData){
      if(typeof(key)==="string"){
        element.style[modify===true?key.replace(/(\B[A-Z])/g,"-$1").toLowerCase():key]=styleData[key];
      }
    }
  }
}