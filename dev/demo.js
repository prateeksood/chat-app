DOM.create("section",{
  id:"messages-area",
  cId:"messagesArea",
  cParentId:"chat",
  children:[
    DOM.create("div",{
      class:"top-bar",
      children:[
        DOM.create("div",{
          class:"dp-holder"
        }), // div.dp-holder
        DOM.create("div",{
          class:"name-holder",
          children:[
            DOM.create("div",{
              class:"user-name"
            }), // div.user-name
            DOM.create("div",{
              class:"msg-preview"
            }) // div.msg-preview
          ]
        }), // div.name-holder
        DOM.create("div",{
          class:"icons",
          children:[
            DOM.create("button",{
              class:"icon",
              title:"Search",
              children:[
                DOM.createNS("svg",{
                  "viewBox":"0 0 32 32",
                  children:[
                    DOM.createNS("use",{
                      "xlink:href":"#search"
                    }) // use
                  ]
                }) // svg
              ]
            }), // button.icon
            DOM.create("button",{
              class:"icon",
              title:"More",
              children:[
                DOM.createNS("svg",{
                  "viewBox":"0 0 32 32",
                  children:[
                    DOM.createNS("use",{
                      "xlink:href":"#menu-vertical"
                    }) // use
                  ]
                }) // svg
              ]
            }) // button.icon
          ]
        }) // div.icons
      ]
    }), // div.top-bar
    DOM.create("div",{
      id:"right-main",
      children:[
        DOM.create("div",{
          class:"message-group",
          children:[
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }) // div.time
                  ]
                }) // div.info
              ]
            }), // div.message-container
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }), // div.message-container
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }) // div.message-container
          ]
        }), // div.message-group
        DOM.create("div",{
          class:"message-group sent",
          children:[
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }), // div.message-container
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }) // div.message-container
          ]
        }), // div.message-group.sent
        DOM.create("div",{
          class:"message-group",
          children:[
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }) // div.message-container
          ]
        }), // div.message-group
        DOM.create("div",{
          class:"message-group sent",
          children:[
            DOM.create("div",{
              class:"message-container",
              children:[
                DOM.create("div",{
                  class:"content"
                }), // div.content
                DOM.create("div",{
                  class:"info",
                  children:[
                    DOM.create("div",{
                      class:"time"
                    }), // div.time
                    DOM.create("div",{
                      class:"icon",
                      children:[
                        DOM.createNS("svg",{
                          "viewBox":"0 0 32 32",
                          children:[
                            DOM.createNS("use",{
                              "xlink:href":"#send-alt-filled"
                            }) // use
                          ]
                        }) // svg
                      ]
                    }) // div.icon
                  ]
                }) // div.info
              ]
            }) // div.message-container
          ]
        }) // div.message-group.sent
      ]
    }), // div#right-main
    DOM.create("div",{
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
            }), // input
            DOM.create("button",{
              type:"submit",
              class:"icon",
              children:[
                DOM.createNS("svg",{
                  "viewBox":"0 0 32 32",
                  children:[
                    DOM.createNS("use",{
                      "xlink:href":"#send-filled"
                    }) // use
                  ]
                }) // svg
              ]
            }) // button.icon
          ]
        }) // form.send-area
      ]
    }) // div.bottom-bar
  ]
})