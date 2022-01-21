/// <reference path="../dom.js"/>
/// <reference path="../ui-handler.js"/>

class Loader extends UIHandler.Component {
  constructor () {
    const element = DOM.create("div", {
      class: "loader-container",
      children: [
        DOM.create("div", {
          class: "loader",
          children: [
            DOM.createNS("svg", {
              viewbox: "0 0 512 512",
              width: "150px",
              height: "150px",
              children: [
                DOM.createNS("path", {
                  class: "chat-box",
                  d: "m113.28204,32l-79.89743,0a14.76,13.845 0 0 0 -14.71795,13.80556l0,47.33333a14.76,13.845 0 0 0 14.71795,13.80556l10.51282,0l0,19.72222l24.63154,-19.26368a2.10256,1.97222 0 0 1 1.34827,-0.45854l43.4048,0a14.76,13.845 0 0 0 14.71795,-13.80556l0,-47.33333a14.76,13.845 0 0 0 -14.71795,-13.80556z"
                }),//path.chat-box
                DOM.createNS("circle", {
                  class: "circle",
                  cx: "48.10256",
                  cy: "69.47222",
                  r: "7.70634"
                }),//circle.circle
                DOM.createNS("circle", {
                  class: "circle",
                  cx: "73.33333",
                  cy: "69.47222",
                  r: "7.70634"
                }),//circle.circle
                DOM.createNS("circle", {
                  class: "circle",
                  cx: "98.5641",
                  cy: "69.47222",
                  r: "7.70634"
                })//circle.circle
              ]
            }),//svg
            DOM.create("div", {
              class: "loading-message",
              html: "Almost There"
            })//div.loading-message
          ]
        })//div.loader
      ]
    })//div.loader-container
    super("loader", element);
  }
}