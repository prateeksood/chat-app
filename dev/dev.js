const TAB_SIZE=2;
/** Show className of element after closing bracket of DOM.create() */
const SHOW_COMMENTS=true;
/** Skip innerText of elements */
const SKIP_TEXT=false;

/** @param {HTMLElement|string} element */
function createDOMSyntax(element,level=0){
  if(typeof element==="string"){
    let temp_element=document.createElement("div");
    temp_element.innerHTML=element;
    temp_element=temp_element.children[0];
    element=temp_element;
  }
  if(!element) return "";
  const is_ns=element.namespaceURI==="http://www.w3.org/2000/svg";
  let string=`${fillSpace(level)}DOM.<span style="color:#FFECB3">create</span>${is_ns?"NS":""}(<span style="color:#e9a167">"${element.localName}"</span>`;
  /** @type {{children:string[]}} */
  const attributes={};
  if(element.hasAttributes()){
    for(const attribute of element.attributes){
      attributes[
        attribute.name.split("-").map((x,i)=>{
          return i>0?x.charAt(0).toUpperCase()+x.slice(1):x
        }).join("")
      ]=attribute.value;
    }
  }
  if(element.children.length>0){
    attributes.children=[];
    for(let index=0;index<element.children.length;index++){
      const child=element.children[index];
      // if(child instanceof HTMLElement)
      attributes.children.push(
        `${createDOMSyntax(child,level+2)}${
          index!==element.children.length-1?",":""
        } <span style="color:#568a59">// ${
          SHOW_COMMENTS?child.localName+""+(
            child.classList.length>0?"."+child.classList.toString().replace(/\s/g,"."):""
          )+(
            child.id?"#"+child.id:""
          ):""
        }</span>`
      );
    }
    attributes.children=`[
${attributes.children.join(`
`)}
${fillSpace(level+1)}]`;
  }else if(!SKIP_TEXT && element.innerText!==""){
    attributes.text=element.innerText;
  }
  const keys=Object.keys(attributes);
  if(keys.length>0){
    string+=`,{
${keys.map(key=>{
  return key==="children"?
    `${fillSpace(level+1)}<span style="color:#55d1d8">${key}</span>:${attributes[key]}`:
    `${fillSpace(level+1)}<span style="color:#55d1d8">${is_ns?`"${key}"`:`${key}`}</span>:<span style="color:#e9a167">"${attributes[key]}"</span>`;
}).join(`,
`)}
${fillSpace(level)}})`;
  }else
    string+=")";
  return string;
}

/** @param {number} count */
function fillSpace(count){
  // return (new Array(count)).fill("  ").join("");
  return "".padStart(count*TAB_SIZE);
}

/** @param {HTMLElement|string} element */
function displayCode(element){
  const string=createDOMSyntax(element);
  document.body.innerHTML="<pre>"+string+"</pre>";
}

window.addEventListener("load",function(){

  const input=document.getElementById("input");
  const output=document.getElementById("output");
  let timeout;

  input.addEventListener("keyup",action);

  function action(){
    clearTimeout(timeout);
    timeout=setTimeout(function(){
      const string=createDOMSyntax(input.value);
      output.innerHTML="<pre>"+string+"</pre>";
    },1000);
  }

  action();
});