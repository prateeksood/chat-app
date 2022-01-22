/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../main.js"/>

/** @extends {UIHandler.Component<HTMLDivElement>} */
class MessageComponent extends UIHandler.Component {
  isGroupMessage=false;
  /** @type {string} */
  sender=null;
  isSent=false;
  /** @param {Message} message Note: be aware! It can be temporary id */
  constructor (message) {
    const content=DOM.create("div", {
      class: "content",
      html: message.content
    });
    const element = DOM.create("div", {
      class: "message-container",
      children: [
        content // div.content
      ]
    }, {/* no styles */}, {
      click() {
        element.toggleAttribute("active");
      },
      contextmenu: event => {
        const chat=App.data.chats.get(message.chatId);
        const [chatMessage]=chat.messages.filter(({id})=>id===this.id);
        if(!chatMessage)
          return;
        const menu=new UIMenu(chatMessage.id);
        menu.addItem("info","Info",()=>{
          const info=chat.getMessageInfo(chatMessage.id);
          const messageInfo=new MessageComponent.MessageInfo(this,info.message,info.readBy,info.receivedBy);
          messageInfo.mount(UI.container.main);
          menu.unmount();
        });
        menu.mount(UI.container.main,event);
      }
    }); //div.message-container

    super(message.id, element);
    /** @type {AutoUpdater} */
    this.messageTime = DOM.create("auto-updater", {
      time: message.createdAt.getTime(),
      class: "time",
      html: App.date.format(message.createdAt)
    });
    this.messageTime.handler = () => {
      DOM.attr(this.messageTime,{
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
    };
    this.messageInfonull;
    this.sent=message.id.includes("temp_")?false:true;
    this.contentElement=content;
  }
  /** @param {boolean} value */
  set sent(value){
    this.isSent=value?true:false;
    this.messageInfo?.remove();
    this.messageInfo=MessageComponent.createInfo(this);
    this.element.appendChild(this.messageInfo);
    this.element.toggleAttribute("active",!this.isSent);
  }
  /** @param {Message} message */
  init(message) {
    this.isGroupMessage=message.isGroupMessage;
    this.sender=message.sender;
  }
  /** @param {Message} message */
  update(message){
    DOM.attr(this.messageTime, {
      time: message.createdAt.getTime(),
      html: App.date.format(message.createdAt)
    });
    this.messageTime.handler = () => {
      DOM.attr(this.messageTime,{
        time: message.createdAt.getTime(),
        html: App.date.format(message.createdAt)
      });
    };
  }
  /** @param {MessageComponent} component */
  static createMessageGroup(component,g=0) {
    const isCurrentUser = App.session.isCurrentUserId(component.sender._id);
    return new UIHandler.Component("group-"+g, DOM.create("div", {
      senderId: component.sender._id,
      class: `message-group${isCurrentUser ? " sent" : ""}`,
      children: [
        (() => {
          if (!isCurrentUser && component.isGroupMessage)
            return DOM.create("div", {
              class: "sender",
              text: component.sender.name
            });
        })()
      ]
    })); //div.message-group
  }
  /** @param {MessageComponent} component */
  static createInfo(component){
    return DOM.create("div", {
      class: "info",
      children: [
        component.isSent ? component.messageTime : DOM.create("div",{text:"sending"}),
        MessageComponent.createIcon(component.isSent)
      ]
    });
  }
  static createIcon(isSent=false){
    return DOM.create("div", {
      class: "icon",
      children: [
        DOM.createNS("svg", {
          viewBox: "0 0 32 32",
          children: [
            DOM.createNS("use", {
              "xlink:href": isSent?"#send-alt-filled":"#in-progress"
            })// use
          ]
        })// svg
      ]
    });// div.icon
  }
}

MessageComponent.MessageInfo=class MessageInfo extends UIHandler.Component{
  static buttons={
    edit:"edit",
    accept:"accept-outline",
    cancel:"cancel-outline",
    processing:"in-progress",
    close:"cancel"
  };
  /**
   * @param {MessageComponent} component
   * @param {Message} message
   * @param {Participant[]} readBy
   * @param {Participant[]} receivedBy
  */
  constructor(component, message, readBy, receivedBy){
    const messageGroup=DOM.create("div", {
      class: `message-group${App.session.isCurrentUserId(message.sender._id) ? " sent" : ""}`,
      html: component.element.outerHTML
    });
    const element=DOM.create("div",{
      class:"container absolute info-area message-info",
      state:"close",
      children:[
        MessageInfo.createActionsRow(()=>{
          this.unmount();
        }),
        MessageInfo.createFieldRow("content","Message", messageGroup.outerHTML),
        // MessageInfo.createFieldRow("createdAt","Sent by",App.date.stringify(message.sender.name)),
        // MessageInfo.createFieldRow("createdAt","Sent at",App.date.stringify(message.createdAt)),
        MessageInfo.createFieldRow("readBy","Sender",[
          [message.sender._id, User.defaultImage, message.sender.name, message.sender.username, message.createdAt]
        ]),
        MessageInfo.createFieldRow("readBy","Read by",
          readBy.length>0 ? readBy.map(function({id,image,name,username,lastRead}){
            return [id,image,name,username,lastRead.time];
          }) : "Nobody"
        ),
        MessageInfo.createFieldRow("recievedBy","Recieved by",
          receivedBy.length>0 ? receivedBy.map(function({id,image,name,username,lastReceived}){
            return [id,image,name,username,lastReceived.time];
          }) : "Nobody"
        )
      ]
    });
    super(message.id,element);
  }
  /** @param {UIHandler.Component} parent */
  mount(parent){
    super.mount(parent);
    setTimeout(()=>this.attr({state:"open"}),10);
  }
  unmount(){
    this.attr({state:"close"});
    setTimeout(()=>super.unmount(),150);
  }
  /**
   * @param {EventListener} clickListener
   * @param {string} text Container Title
   */
  static createActionsRow(clickListener,text="Message Details"){
    return DOM.create("div",{
      class:"row actions",
      children:[
        DOM.create("h3",{text}),
        MessageInfo.createButton("close",clickListener)
      ]
    });
  }
  /**
   * @param {string} fieldName
   * @param {string} text
   * @param {string|[itemId: string, imageSrc: string, mainText: string, subText: string, time: number | Date][]} values */
  static createFieldRow(fieldName,text,values){
    const textContents=typeof values === "string" ? [DOM.create("div",{
      class:"text-content",
      html:values
    })] : values.map(value=>{
      const listItem=new ListItem(...value);
      return listItem.element;
    });
    const rowField=DOM.create("div",{
      class:"row field",
      children:[
        DOM.create("label",{
          for:fieldName,
          text
        }), // label
        ...textContents
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
              "xlink:href": "#"+MessageInfo.buttons[type]
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
              "xlink:href": "#"+MessageInfo.buttons[type]
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
              "xlink:href": "#"+MessageInfo.buttons[type]
            }) // use
          ]
        })
      ]
    });
  }
};