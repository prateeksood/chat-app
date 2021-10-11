/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

class ChatArea extends UIHandler.Component{
  constructor(){
    const element=DOM.create("div",{
      class:"chat-area"
    });
    super("id",element);
  }
};

ChatArea.TopBar=class TopBar extends UIHandler.Component{};