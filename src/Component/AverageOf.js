import Utils from "../Utils.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";
</style>

<div>ao5: <span class="ao5"></span></div>
<div>ao12: <span class="ao12"></span></div>
`;

export class AverageOf extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$ao5 = this.shadowRoot.querySelector(".ao5");
    this.$ao12 = this.shadowRoot.querySelector(".ao12");
  }

  connectedCallback() {}

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["solves"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    this.$ao5.innerHTML = "-";
    this.$ao12.innerHTML = "-";

    const ao5 = this.calculateAverageOf(5);
    const ao12 = this.calculateAverageOf(12);

    if (ao5 !== null) {
      const formattedTime = Utils.formatElapsedTime(ao5);
      this.$ao5.innerHTML =
        formattedTime.hours +
        formattedTime.minutes +
        formattedTime.seconds +
        formattedTime.milliseconds;
    }
    if (ao12 !== null) {
        const formattedTime = Utils.formatElapsedTime(ao12);
        this.$ao12.innerHTML =
          formattedTime.hours +
          formattedTime.minutes +
          formattedTime.seconds +
          formattedTime.milliseconds;
    }
  }

  get solves() {
    return this.getAttribute("solves");
  }

  calculateAverageOf = (number) => {
    if (this.solves.split(",").length < number) {
      return null;
    }
    return (
      this.solves
        .split(",")
        .slice(0, number)
        .map((solve) => parseInt(solve))
        .reduce((accumulator, current) => accumulator + current) / 5
    );
  };
}

window.customElements.define("component-average-of", AverageOf);
