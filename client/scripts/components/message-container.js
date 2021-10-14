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
                  html:MessageComponent.showFormatedTime(messageTime)
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
  static showFormatedTime(date){
    const milliInDay=8.64e+7;
    const milliInYear=3.154e+10;
    const milliInMin=60000;
    const istOffset=1.98e+7;

    const monthname=["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    date=(new Date(date)).getTime();
    date=new Date(date+istOffset);
    const today=new Date(Date.now()+istOffset);
    if(today-date>milliInYear){
      return `${date.getDate()} ${monthname[date.getMonth()]}, ${date.getFullYear()}`;
    }
    if(today-date>milliInDay){
      return `${date.getDate()} ${monthname[date.getMonth()]}`;
    }
    if(today-date<milliInMin){
      return `Few seconds ago`;
    }
    return `${date.getHours()>12?date.getHours()-12:date.getHours()}:${date.getMinutes()} ${date.getHours()>12?"pm":"am"}`
  }
  send(){

  }
}