const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";
</style>

<footer class="fixed scramble-visual">
    <img alt="visual" src=""/>
</foter>
`;

export class Scramble extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$img = this.shadowRoot.querySelector("img");
  }

  connectedCallback() {}

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["algorithm"];
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    this.$img.setAttribute(
      "src",
      "https://puzzle-generator.robiningelbrecht.be/cube?view=net&cube[algorithm]=" + newValue.split(",").join(" ")
    );
  }

  get algorithm() {
    return this.getAttribute("algorithm");
  }

  set algorithm(value) {
    this.setAttribute("algorithm", value);
  }
}

window.customElements.define("component-scramble-visual", Scramble);
