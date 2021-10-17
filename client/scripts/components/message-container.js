/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>


class MessageComponent extends UIHandler.Component{
  #messageContent="";
  #recipient;
  #sender;
  /**
   * 
   * @param {string} messageContent 
   * @param {Date} messageTime 
   * @param {boolean} isSent 
   */
  constructor(messageContent,messageTime,isSent=false){
    // this.#messageContent=messageContent;
    // this.#recipient=recipient;
    // this.#sender=sender;
    const element=DOM.create("div",{
      class:`message-group ${isSent ? " sent" : ""}` ,
      children: [
        DOM.create("div",{
          class:"message-container",
          children:[
            DOM.create("div",{
              class:"content",
              html:messageContent
            }), // div.content
            DOM.create("div",{
              class:"info",
              children:[
                DOM.create("div",{
                  class:"time",
                  html:App.date.stringify(messageTime)
                }), // div.time
                DOM.create("div",{
                  class:"icon",
                  children:[
                    DOM.createNS("svg",{
                      viewBox:"0 0 32 32",
                      children:[
                        DOM.createNS("use",{
                          "xlink:href":"#send-alt-filled"
                        })// use
                      ]
                    })// svg
                  ]
                })// div.icon
              ]
            })// div.info
          ]
        })//div.message-container
      ]
    })//div.message-group
    
   
    super("message",element);
  }
}