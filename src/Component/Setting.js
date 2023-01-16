import Event from "../Eventing/Event.js";
import EventDispatcher from "../Eventing/EventDispatcher.js";
import Settings from "../Settings.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
@import "../../libraries/beercss/beer.min.css";
</style>
<div class="field middle-align">
  <nav>
    <div class="max">
        <h5 class="small title"></h5>
        <div class="small-text description"></div>
    </div>
    <label class="switch">
      <input type="checkbox">
      <span></span>
    </label>
  </nav>  
</div>
`;

export class Setting extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.$checkbox = this.shadowRoot.querySelector("input");
    this.$title = this.shadowRoot.querySelector(".title");
    this.$description = this.shadowRoot.querySelector(".description");
    this.$icons = this.shadowRoot.querySelector(".switch span");
  }

  connectedCallback() {
    this.$title.innerHTML = this.title;
    this.$description.innerHTML = this.description;

    this.$checkbox.addEventListener("click", () => {
      const isChecked = this.$checkbox.checked;
      Settings.set(this.id, isChecked);
      EventDispatcher.dispatch(Event.settingWasUpdated, { id: this.id, isChecked: isChecked });
    });

    if (this.icons) {
      this.$icons.innerHTML = this.icons
        .split(",")
        .map((icon) => "<i>" + icon + "</i>")
        .join("");
    }
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["checked"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    const isChecked = Boolean(this.checked);
    if (isChecked) this.$checkbox.setAttribute("checked", "");
    else this.$checkbox.removeAttribute("checked", "");
  }

  get id() {
    return this.getAttribute("id");
  }

  get title() {
    return this.getAttribute("title");
  }

  get description() {
    return this.getAttribute("description");
  }

  get icons() {
    return this.getAttribute("icons");
  }

  get checked() {
    return this.hasAttribute("checked");
  }

}

window.customElements.define("component-setting", Setting);
