/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>

class LocalLoader extends UIHandler.Component {
  constructor () {
    const element = DOM.create("div", {
      class: "local-loader",
      children: [
        DOM.create("div", {
          class: "spinner",
          children: [
            DOM.create("div", {
              class: "dot",
              id: "dot-1"
            }),//div#dot-1
            DOM.create("div", {
              class: "dot",
              id: "dot-2"
            }),//div#dot-2
            DOM.create("div", {
              class: "dot",
              id: "dot-3"
            }),//div#dot-3
          ]
        })//div.spinner
      ]
    })//div.local-loader
    super("localLoader", element);
  }
}