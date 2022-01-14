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
  /** @param {User} user */
  static createPictureRow(user){
    const dpHolder=DOM.create("div",{class:"dp-holder"},{
      backgroundImage:`url("${user.image}")`
    });
    const button=Profile.createButton("edit",function(){
      Profile.changeButtonType(button,"edit");
      const file=DOM.create("input",{
        type:"file",
        accept:"image/jpeg, image/png"
      },{/* no style */},{
        async change(){
          Profile.changeButtonType(button,"processing");
          const formData=new FormData();
          formData.append("profilePicture",file.files[0]);
          /** @type {UserResponse} */
          const response=await App.request("user/upload/profilePicture",{
            method:"POST",
            body:formData
          },false);
          if(response){
            DOM.style(dpHolder,{backgroundImage:`url("${user.setImage(response.image)}")`})
            UI.container.chat.sub.userDPHolder.sub.image.attr({src:user.image});
          }
          Profile.changeButtonType(button,"edit");
        }
      });
      file.click();
    });
    return DOM.create("div",{
      class:"row column",
      children:[
        DOM.create("div",{
          class:"picture-container",
          children:[
            dpHolder, // div.dp-holder
            button // button.icon.edit
          ]
        },{/* no style */},{
          // submit(event){
          //   event.preventDefault();
          //   console.log();
          // }
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
        Profile.createButton("accept",async function(){
          input.disabled=true;
          DOM.attr(rowField,{state:"process"});
          const formData=new FormData();
          formData.append("value", input.value);
          /** @type {UserResponse} */
          const response=await App.request("user/update/"+fieldName,{
            method:"POST",
            body:new URLSearchParams(formData)
          },false);
          if(response){
            value=input.value;
            App.popAlert(fieldName," updated");
            rowField.removeAttribute("state");
            input.blur();
          }else{
            input.disabled=false;
            input.focus();
            DOM.attr(rowField,{state:"open"});
          }
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
  /**
   * @param {HTMLButtonElement} button
   * @param {keyof Profile.buttons} type */
  static changeButtonType(button,type,size=32){
    button.innerHTML="";
    DOM.attr(button,{
      children:[
        DOM.createNS("svg",{
          "viewBox":"0 0 "+size+" "+size,
          children:[
            DOM.createNS("use",{
              "xlink:href": "#"+Profile.buttons[type]
            }) // use
          ]
        })
      ]
    });
  }
}

class ContactProfile extends UIHandler.Component{
  static buttons={
    edit:"copy"
  };
  /** @param {Contact} user */
  constructor(user){
    const element=DOM.create("div",{
      class:"container absolute profile",
      state:"close",
      children:[
        ContactProfile.createActionsRow(()=>{
          this.attr({state:"close"});
          setTimeout(()=>this.unmount(),150);
        },user.name),
        ContactProfile.createPictureRow(user),
        ContactProfile.createUsernameRow(user.username),
        ContactProfile.createFieldRow("lastSeen","Last Seen",App.date.format(user.lastseen)),
        ContactProfile.createFieldRow("since","Contact Since",App.date.format(user.since))
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
    return DOM.create("div",{
      class:"row column",
      children:[
        DOM.create("div",{
          class:"picture-container",
          children:[
            DOM.create("div",{class:"dp-holder"},{
              backgroundImage:`url("${user.image}")`
            }) // div.dp-holder
          ]
        })
      ]
    });
  }
  static createUsernameRow(username){
    return DOM.create("div",{
      class:"row username",
      children:[
        DOM.create("p",{
          text:"@"+username
        })
      ]
    });
  }
  static createFieldRow(fieldName,text,value){
    value=typeof value==="string"?value:"";
    const input=DOM.create("input",{
      type:"text",
      name:fieldName,
      placeholder:text,
      disabled:true,
      value
    }); // input
    const rowField=DOM.create("div",{
      class:"row field",
      children:[
        DOM.create("label",{
          for:fieldName,
          text
        }), // label
        input,
        ContactProfile.createButton("edit",function(){})
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
              "xlink:href": "#"+ContactProfile.buttons[type]
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