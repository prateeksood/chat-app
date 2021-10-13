/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>
/// <reference path="../sessions.js" />

class ChatArea extends UIHandler.Component{
  /**
   * To manage message components
   * @type {UIHandler.ComponentList<Message>}
  */
  #messages=new UIHandler.ComponentList();

  /** @param {Chat} chat */
  constructor(chat){

    const element=DOM.create("div",{
      class:"chat-area",
      children:[
        ChatArea.createTopBar(chat),
        DOM.create("div",{
          class:"right-main"
        }),  // div.right-main
        ChatArea.createBottomBar()
      ]
    });  // div.chat-area

    // Whenever a Message component is inserted into the this.#messages using this.#messages.insert method
    this.#messages.on("insert",component=>{
      element.appendChild(component.element);
      // or
      // component.mount(this);
    });
    // Whenever a Message component is deleted from the this.#messages using this.#messages.delete method
    this.#messages.on("delete",component=>{
      component.unmount();
    });

    chat.messages.forEach(message=>{
      const component=new Message(message);
      this.#messages.insert(component);
    });
    super("chatArea",element);
  }
  /** @param {Chat} chat */
  static createTopBar(chat){
    return DOM.create("div",{
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
              html:chat.title
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
                    }) //use
                  ]
                }) //svg.icon
              ]
            }) //div.icons
          ]
        }) //div.icons
      ]
    }) // div.top-bar
  }
  /** @param {Chat} chat */
  static createBottomBar(chat){
    return DOM.create("div",{
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
    }); //div.bottom-bar
  }
};