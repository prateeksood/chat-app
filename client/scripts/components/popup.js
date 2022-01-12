/// <reference path="../dom.js"/>
/// <reference path="../listener.js"/>
/// <reference path="../ui-handler.js"/>

class Popup extends UIHandler.Component {
  #listener = new Listeners(["open", "close"]);
  static createIcon(id, size = 24) {
    return DOM.createNS("svg", {
      viewBox: "0 0 " + size + " " + size, children: [
        DOM.createNS("use", { "xlink:href": "#" + id })
      ]
    });
  }
  /**
   * @callback popupAction
   * @param {Popup} popup
   * @param {Event} event
   * @returns
   * @param {Popup} popup
   * @param {"accept"|"cancel"} type
   * @param {string} value
   * @param {popupAction} action
   */
  static createAction(popup, type, value, action) {
    return DOM.create("button", {
      class: type,
      text: value
    }, {}, {
      click(event) {
        action(popup, event);
      }
    });
  }
  /**
   * Create a new Popup
   * @param {string} title
   * @param {string|Element} content
   * @param {{type:"accept"|"cancel",value:string,action:popupAction}[]} actions
   * @param {string} iconId
   */
  constructor (title, content, actions = [], iconId = "notifications") {
    const actionsElement = DOM.create("div", { class: "actions" });
    const element = DOM.create("div", {
      class: "prompt",
      children: [
        DOM.create("fieldset", {
          class: "prompt",
          children: [
            DOM.create("legend", {
              children: [
                DOM.create("div", {
                  class: "title",
                  children: [
                    Popup.createIcon(iconId),
                    DOM.create("span", { html: title })
                  ] // title children
                }) // title
              ] // legend children
            }), // legend
            DOM.create("div", {
              class: "content",
              html: content
            }) // content
          ] // prompt children
        }), //fieldset
        actionsElement // actions
      ]
    });
    super("popup", element);
    const that = this;
    let children;
    if (actions.length > 0) {
      children = actions.map(function (action) {
        return Popup.createAction(that, action.type, action.value, action.action);
      });
    } else {
      children = [
        Popup.createAction(that, "cancel", "Cancel", function () {
          that.close();
        })
      ];
    }
    DOM.attr(actionsElement, { children });
    this.open();
  }
  open() {
    this.#listener.trigger("open");
  }
  close() {
    this.element.remove();
    this.#listener.trigger("close");
  }
  on(eventName, action) {
    this.#listener.on(eventName, action);
  }
};

class UINotification extends UIHandler.Component {
  #timeoutTime = 0;
  #timeout;
  #listener = new Listeners(["open", "close", "hide"]);
  static createIcon(id, size = 32) {
    return DOM.createNS("svg", {
      viewBox: "0 0 " + size + " " + size, children: [
        DOM.createNS("use", { "xlink:href": "#" + id })
      ]
    });
  }
  static createAction(notification, type, iconId, action = null) {
    const events = {};
    let className = "";
    if (action) {
      className = "icon button ";
      events.click = function (event) {
        action(notification, event);
      }
    }
    return DOM.create("button", {
      class: className + type,
      children: [UINotification.createIcon(iconId)]
    }, {}, events);
  }
  /**
   * @param {NotificationManager} notificationManager
   * @param {string|Element} content
   * @param {{type:"accept"|"cancel"|"processing",iconId:string,action:popupAction}[]} actions
   * @param {null|"accept"|"error"|"processing"} type
   * @param {null|number} timeout
   */
  constructor (content, actions = [], type = null, timeout = 10000) {
    const actionsElement = DOM.create("div", { class: "actions" });

    const element = DOM.create("div", {
      class: "notification" + (type ? " " + type : ""),
      hidden: "true",
      children: [
        DOM.create("div", { class: "content", html: content }),
        actionsElement
      ]
    });
    super("notification", element);

    this.#timeoutTime = timeout;
    const children = actions ? actions.map(action => {
      if (action.type === "cancel") {
        if (!action.action) {
          action.action = () => this.close();
        }
        if (!action.iconId) {
          action.iconId = "cancel-outline";
        }
      } else if (action.type === "accept") {
        if (!action.iconId) {
          action.iconId = "accept-outline";
        }
      } else if (action.type === "processing") {
        if (!action.iconId) {
          action.iconId = "processing";
        }
        action.action = null;
      }
      return UINotification.createAction(this, action.type, action.iconId, action.action);
    }) : [];
    if (children.length === 0)
      children.push(UINotification.createAction(this, "cancel", "cancel-outline", () => this.close()));
    DOM.attr(actionsElement, { children });
    this.open();
  }
  get element() {
    return this.element;
  }
  open() {
    clearTimeout(this.#timeout);
    if (this.#timeoutTime > 0) {
      this.#timeout = setTimeout(() => this.close(), this.#timeoutTime);
    }
    this.element.setAttribute("hidden", "false");
    this.#listener.trigger("open");
  }
  close() {
    clearTimeout(this.#timeout);
    this.element.setAttribute("hidden", "true");
    this.#listener.trigger("close");
  }
  on(eventName, action) {
    this.#listener.on(eventName, action);
  }
};