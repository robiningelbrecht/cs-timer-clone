import Event from "../Eventing/Event.js";
import EventDispatcher from "../Eventing/EventDispatcher.js";
import Settings from "../Settings.js";
import Utils from "../Utils.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";
</style>
<nav class="wrap row">
    <button class="round square extra" theme="red"></button>
    <button class="round square extra" theme="pink"></button>
    <button class="round square extra" theme="purple"></button>
    <button class="round square extra" theme="deep-purple"></button>
    <button class="round square extra" theme="indigo"></button>
    <button class="round square extra" theme="blue"></button>
    <button class="round square extra" theme="light-blue"></button>
    <button class="round square extra" theme="cyan"></button>
    <button class="round square extra" theme="teal"></button>
    <button class="round square extra" theme="green"></button>
    <button class="round square extra" theme="light-green"></button>
    <button class="round square extra" theme="lime"></button>
    <button class="round square extra" theme="yellow"></button>
    <button class="round square extra" theme="amber"></button>
    <button class="round square extra" theme="orange"></button>
    <button class="round square extra" theme="deep-orange"></button>
    <button class="round square extra" theme="brown"></button>
</nav>
`;

export class ThemePicker extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$nav = this.shadowRoot.querySelector("nav");
    this.$buttons = this.shadowRoot.querySelectorAll("button");
  }

  connectedCallback() {
    this.$buttons.forEach(($button) => {
      const themeName = $button.getAttribute("theme");
      $button.classList.add(themeName);
      const themeColor = window
        .getComputedStyle($button, null)
        .getPropertyValue("background-color");

      $button.addEventListener("click", () => {
        this.setAttribute("selected-theme", themeName);
        const theme = {
          name: themeName,
          color: Utils.rgba2hex(themeColor),
        };
        Settings.set(Settings.THEME, theme);
        EventDispatcher.dispatch(Event.themeWasUpdated, theme);
      });
    });
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["selected-theme"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    this.$buttons.forEach(($button) => {
      $button.innerHTML = "";
    });

    this.$nav.querySelector('button[theme="' + newValue + '"]').innerHTML =
      "<i>check</i>";
  }
}

window.customElements.define("component-theme-picker", ThemePicker);
