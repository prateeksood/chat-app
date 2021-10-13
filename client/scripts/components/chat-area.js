/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../sessions.js" />

// const session=new Session();
class ChatArea extends UIHandler.Component{

  /**
   * 
   * @param {string} chatID
   * @param {{_id: string,chatID: string,sender: string,recipient:string,content:string,createdAt:Date,updatedAt:Date}[]} previewMessages
   */
  constructor(chatID,previewMessages){
    let messages = [];

    const element=DOM.create("div",{
      id:"right-main"
    }) //div.right-main
    previewMessages.forEach(message=>{
      element.appendChild(new Message(message.content,message.updatedAt,App.session.getCurrentUser()._id===message.sender).element);
    });
    super("chatArea",element);
  }
};

ChatArea.TopBar=class TopBar extends UIHandler.Component{

  /**
   * 
   * @param {string} username 
   * @param {string} _id 
   */
  constructor(username,_id){
    const element=DOM.create("div",{
      class:"top-bar top-bar-right",
      children:[
        DOM.create("div",{
          class:"dp-holder"
        }), //div.dp-holder
        DOM.create("div",{
          class:"name-holder",
          children:[
            DOM.create("div",{
              class:"user-name",
              html:`@${username}`
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
      class:"bottom-bar bottom-bar-right",
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