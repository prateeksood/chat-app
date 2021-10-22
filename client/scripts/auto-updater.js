class AutoUpdater extends HTMLElement{
  /** @type {Map<number,Listener>} */
  static #listener=new Map();
  static timeout={};
  #handler;
  #timeoutTime=60000;
  /** @param {<>(handler:AutoUpdater) void} handler */
  constructor(handler){
    super();
    this.#handler=handler??(()=>{});
  }
  get handler(){
    return this.#handler;
  }
  set handler(value){
    const listener=AutoUpdater.#getListener(this.#timeoutTime);
    listener.off(this.#handler);
    this.#handler=value;
    listener.on(this.#handler);
  }
  static #getListener(timeout){
    if(AutoUpdater.#listener.has(timeout)){
      AutoUpdater.#start(timeout);
      return AutoUpdater.#listener.get(timeout);
    }else{
      const listener=new Listener();
      AutoUpdater.#listener.set(timeout,listener);
      return listener;
    }
  }
  static #start(timeout){
    clearTimeout(AutoUpdater.timeout[timeout]);
    AutoUpdater.timeout[timeout]=setInterval(()=>{
      this.#listener.get(timeout).trigger();
    },timeout);
  }
  connectedCallback(){
    const timeoutTime=this.getAttribute("timeout");
    this.#timeoutTime=timeoutTime?parseInt(timeoutTime):this.#timeoutTime;
    AutoUpdater.#getListener(this.#timeoutTime).on(this.#handler);
  }
  disconnectedCallback(){}
}

customElements.define("auto-updater",AutoUpdater);