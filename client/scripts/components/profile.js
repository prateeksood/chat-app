/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../types/user.js"/>

class Profile extends UIHandler.Component{
  static buttons={
    edit:"edit",
    accept:"accept-outline",
    cancel:"cancel-outline",
    processing:"in-progress",
    close:"cancel"
  };
  /** @param {User} user */
  constructor(user){
    const element=DOM.create("div",{
      class:"container absolute profile",
      state:"close",
      children:[
        Profile.createActionsRow(()=>{
          this.attr({state:"close"});
          setTimeout(()=>this.unmount(),150);
        }),
        Profile.createPictureRow(user),
        Profile.createFieldRow("name","Display Name",user.name,"This name will be visible to your contacts"),
        Profile.createFieldRow("username","Username",user.username),
        Profile.createFieldRow("email","Email",user.email)
      ]
    });
    super(user.id,element);
  }
  /** @param {UIHandler.Component} parent */
  mount(parent){
    super.mount(parent);
    setTimeout(()=>this.attr({state:"open"}),10);
  }
  /**
   * @param {EventListener} clickListener
   * @param {string} text Container Title
   */
  static createActionsRow(clickListener,text="Profile"){
    return DOM.create("div",{
      class:"row actions",
      children:[
        DOM.create("h3",{text}),
        Profile.createButton("close",clickListener)
      ]
    });
  }
  static createPictureRow(user){
    console.log(user.image);
    return DOM.create("div",{
      class:"row column",
      children:[
        DOM.create("div",{
          class:"picture-container",
          children:[
            DOM.create("div",{class:"dp-holder"},{
              backgroundImage:`url("${user.image??User.defaultImage}")`
            }), // div.dp-holder
            Profile.createButton("edit") // button.icon.edit
          ]
        })
      ]
    });
  }
  static createFieldRow(fieldName,text,value,description=null){
    value=typeof value==="string"?value:"";
    const input=DOM.create("input",{
      type:"text",
      name:fieldName,
      placeholder:text,
      disabled:true,
      value
    },{/* No style */},{
      keyup(){
        if(input.value!==value)
          DOM.attr(rowField,{state:"open"});
        else
          rowField.removeAttribute("state");
      },
      blur(){
        if(input.value===value)
          input.disabled=true;
      }
    }); // input
    input.selectionStart=input.value.length;
    const rowField=DOM.create("div",{
      class:"row field",
      children:[
        DOM.create("label",{
          for:fieldName,
          text
        }), // label
        input,
        Profile.createButton("edit",function(){
          input.disabled=false;
          input.focus();
        }),
        Profile.createButton("accept",function(){
          DOM.attr(rowField,{state:"process"});
        }),
        Profile.createButton("cancel",function(){
          rowField.removeAttribute("state");
          input.disabled=true;
          input.value=value;
        }),
        Profile.createIcon("processing"),
        DOM.create("div",{
          class:"description",
          text:description??""
        }) // div.description
      ]
    });
    return rowField;
  }
  /**
   * @param {keyof Profile.buttons} type
   * @param {EventListener} clickListener
   */
  static createButton(type,clickListener=null,size=32){
    return DOM.create("button",{
      class:"icon "+type,
      children:[
        DOM.createNS("svg",{
          "viewBox":"0 0 "+size+" "+size,
          children:[
            DOM.createNS("use",{
              "xlink:href": "#"+Profile.buttons[type]
            }) // use
          ]
        }) // svg
      ]
    },{/* No styles */},{
      click:clickListener
    }); // button.icon.edit
  }
  /** @param {keyof Profile.buttons} type */
  static createIcon(type,size=32){
    return DOM.create("div",{
      class:"icon "+type,
      children:[
        DOM.createNS("svg",{
          "viewBox":"0 0 "+size+" "+size,
          children:[
            DOM.createNS("use",{
              "xlink:href": "#"+Profile.buttons[type]
            }) // use
          ]
        }) // svg
      ]
    }); // button.icon.edit
  }
}