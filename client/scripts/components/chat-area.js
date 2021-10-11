/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../sessions.js" />

const UI=new UIHandler();
class ChatArea extends UIHandler.Component{
  
  #messages;
  /**
   * 
   * @param {{content: string, sender: string, time: Date}[] } messages 
   */
  constructor(messages){
    messages.forEach(message=>{
      this.#messages.push(new Message(message.content,message.time,Session.currentUserID===message.sender));
    })
    //  UI.container.messagesArea.addChildren([
    const element=DOM.create("div",{
      class:"right-main",
      children:[
        ...messages
      ]
    }) //div.right-main
      
    // ])
    super("chatArea",element);
  }
};

ChatArea.TopBar=class TopBar extends UIHandler.Component{

  constructor(){
    const element=DOM.create("div",{
      class:"top-bar",
      childern:[
        DOM.create("div",{
          class:"dp-holder"
        }), //div.dp-holder
        DOM.create("div",{
          class:"name-holder",
          children:[
            DOM.create("div",{
              class:"user-name",
              html:"Full Name"
            }), // div.user-name
            DOM.create("div",{
              class:"message-preview",
              html:"typing...."
            })//div.message-preview
          ]
        }),// div.name-holder
        DOM.create("div",{
          class:"icons",
          children:[
            DOM.create("button",{
              class:"icon",
              title:"Search",
              children:[
                DOM.createNS("svg",{
                  viewBox:"0 0 32 32",
                  children:[
                    DOM.createNS("use",{
                      "xlink:href":"#search"
                    })//use
                  ]
                })//svg.icon
              ]
            })//div.icons
          ]
        })//div.icons
      ]
    })// div.top-bar

    super("topBar",element);
  }
};

ChatArea.BottomBar = class BottomBar extends UIHandler.Component{
  constructor(){
    const element=DOM.create("div",{
      class:"bottom-bar",
      children:[
        DOM.create("form",{
          class:"send-area",
          action:"#",
          method:"dialog",
          children:[
            DOM.create("input",{
              type:"text",
              name:"message",
              placeholder:"Type a message...",
              autocomplete:"off"
            }),//input
            DOM.create("button",{
              type:"submit",
              class:"icon",
              children:[
                DOM.createNS("svg",{
                  viewBox:"0 0 32 32",
                  children:[
                    DOM.createNS("use",{
                      "xlink:href":"#send-filled"
                    })// use
                  ]
                })//svg
              ]
            })//div.icon
          ]
        }), // div.send-area
      ]
    })//div.bottom-bar

    super("bottomBar",element);
  }
}