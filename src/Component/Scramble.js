import Utils from "../Utils.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";

.algorithm {
    display: flex;
    font-size: 2.2em;
    gap: 0.5em;
    letter-spacing: 0;
}
</style>
<div class="scramble">
    <div class="algorithm"></div>
    <button class="transparent"><i>autorenew</i></button>
</div>
`;

export class Scramble extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$button = this.shadowRoot.querySelector("button");
    this.$div = this.shadowRoot.querySelector("div.algorithm");
  }

  connectedCallback() {
    this.$button.addEventListener("click", () => {
      this.algorithm = Utils.randomScramble(20);
    });
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["algorithm"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    this.$div.innerHTML = this.algorithm
      .split(",")
      .map((move) => "<span>" + move + "</span>")
      .join("");
  }

  get algorithm() {
    return this.getAttribute("algorithm");
  }

  set algorithm(value) {
    this.setAttribute("algorithm", value);
  }
}

window.customElements.define("component-scramble", Scramble);
