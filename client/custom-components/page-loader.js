const loaderTemplate = document.createElement('template');
loaderTemplate.innerHTML = `
<div class="loader-container" c-id="loader">
    <div class="loader">
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path class="chat-box"
            d="m113.28204,32l-79.89743,0a14.76,13.845 0 0 0 -14.71795,13.80556l0,47.33333a14.76,13.845 0 0 0 14.71795,13.80556l10.51282,0l0,19.72222l24.63154,-19.26368a2.10256,1.97222 0 0 1 1.34827,-0.45854l43.4048,0a14.76,13.845 0 0 0 14.71795,-13.80556l0,-47.33333a14.76,13.845 0 0 0 -14.71795,-13.80556z" />
          <circle class="circle" cx="48.10256" cy="69.47222" r="7.70634" id="svg_2" stroke="null" />
          <circle class="circle" cx="73.33333" cy="69.47222" r="7.70635" id="svg_3" stroke="null" />
          <circle class="circle" cx="98.5641" cy="69.47222" r="7.70635" id="svg_4" stroke="null" />
        </g>
      </svg>
      <div class="loading-message"></div>
    </div>
  </div>
`

class PageLoader extends HTMLElement {
  #message
  #show;
  constructor () {
    super();
    this.appendChild(loaderTemplate.content.cloneNode(true));
    this.#show = this.getAttribute("show");
    this.#message = this.getAttribute("message") ?? "Loading";
    this.querySelector(".loading-message").innerHTML = this.#message;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
  static get observedAttributes() {
    return ["show", "message"];
  }

  attributeChangedCallback(show, message) {
    this.#message = this.getAttribute("message") ?? "Loading";
    this.querySelector(".loading-message").innerHTML = this.#message;
  }
  render() {
  }
}
window.customElements.define('page-loader', PageLoader);