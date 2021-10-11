/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>



const UI=new UIHandler();
class friendsArea extends UIHandler.Component{
  contructor(){
    const element=DOM.create("div",{
      class:"left-main",
      children:[
        DoM.create("div",{
          class:"chat-item",
          children:[
            DoM.create("div",{
              class:"dp-holder",
              children:[
                DoM.create("img",{
                  src:imgSrc,
                  alt:"Profile Picture"
                })//img
              ]
            }),//div.dp-holder
            DOM.create("div",{
              class:"name-holder",
              children:[
                DOM.create("div",{
                  class:"user-name",
                  html:"User Name",
                }),//div.user-name
                DOM.create("div",{
                  class:"msg-preview",
                  html:"Sample Message...."
                })//div.msg-preview
              ]
            }),//div.name-holder
            DOM.create("div",{
              class:"other-info",
              children:[
                DoM.create("div",{
                  class:"msg-time",
                  html:"10:56"
                })//div.msg-time
              ]
            })//div.other-info
          ]
        })//div.chat-item
      ]
    })//div.left-main
    super("friendsArea",element);
  }
}