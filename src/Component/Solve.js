import Utils from "../Utils.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";

:host{
    cursor: pointer;
}
</style>
<article>
    <div class="solved-on small-text"></div>
    <div class="time center-align"></div>
</article>
`;

const templateModalConent = document.createElement("template");
templateModalConent.innerHTML = `
<div class="header">
    <div class="time"></div>
    <div class="solved-on small-text"></div>
</div>
<div class="small-divider"></div>
<div class="content">
    <div class="scramble"></div>
    <div class="scramble-visual"></div>
</div>
<div class="small-divider"></div>
`;

export class Solve extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$solvedOn = this.shadowRoot.querySelector(".solved-on");
    this.$time = this.shadowRoot.querySelector(".time");
  }

  connectedCallback() {
    const date = this.solvedOn;
    const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
      date
    );
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

    this.$solvedOn.innerHTML = `${day}/${month}`;

    const formattedTime = Utils.formatElapsedTime(this.timeInMilliseconds);
    this.$time.innerHTML =
      formattedTime.hours +
      formattedTime.minutes +
      formattedTime.seconds +
      formattedTime.milliseconds;

    this.addEventListener("click", this._onClick);
    document.getElementById("solve").addEventListener("click", this._onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    document
      .getElementById("solve")
      .removeEventListener("click", this._onClick);
  }

  get timeInMilliseconds() {
    return this.getAttribute("time-in-milli-seconds");
  }

  get solvedOn() {
    return new Date(parseInt(this.getAttribute("solved-on")));
  }

  get scramble() {
    return this.getAttribute("scramble");
  }

  _onClick = () => {
    const modal = document.getElementById("solve");
    modal.classList.toggle("active");

    const modalContent = modal.querySelector(".modal > .content");
    modalContent.innerHTML = "";
    modalContent.appendChild(templateModalConent.content.cloneNode(true));

    const $time = modalContent.querySelector('.time');
    const $solvedOn = modalContent.querySelector('.solved-on');
    const $scramble = modalContent.querySelector('.scramble');
    const $scrambleVisual = modalContent.querySelector('.scramble-visual');

    const formattedTime = Utils.formatElapsedTime(this.timeInMilliseconds);
    $time.innerHTML =
      formattedTime.hours +
      formattedTime.minutes +
      formattedTime.seconds +
      formattedTime.milliseconds;

      const date = this.solvedOn;
      const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
      const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
        date
      );
      const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
      $solvedOn.innerHTML = `${day} ${month} ${year}`;

      $scramble.innerHTML = this.scramble.split(",")
      .map((move) => "<span>" + move + "</span>")
      .join("");
      $scrambleVisual.innerHTML = `<component-scramble-visual algorithm="${this.scramble}"></component-scramble-visual>`;
  };
}

window.customElements.define("component-solve", Solve);
