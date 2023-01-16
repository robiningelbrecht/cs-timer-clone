const template = document.createElement("template");
template.innerHTML = `
<style>

:host {
  font-family: 'lcd';
  font-size: 20em;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

div.milliseconds {
    font-size: 0.75em;
}

.ellipsis{
  display: none;
}

:host([hide-time][running]) .ellipsis{
  display: block;
}
:host([hide-time][running]) div:not(.ellipsis){
  display: none;
}

</style>

  <div class="ellipsis">...</div>
  <div class="hours"></div><div class="minutes"></div><div class="seconds"></div><div class="milliseconds"></div>

`;

export class Timer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.$ellipsis = this.shadowRoot.querySelector(".ellipsis");
    this.$milliseconds = this.shadowRoot.querySelector(".milliseconds");
    this.$seconds = this.shadowRoot.querySelector(".seconds");
    this.$minutes = this.shadowRoot.querySelector(".minutes");
    this.$$hours = this.shadowRoot.querySelector(".hours");

    this.startTime = null;
  }

  connectedCallback() {}

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["start", "stop", "reset"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "start" && !this.running) {
      this._startTimer();

      return;
    }

    if (name === "stop" && this.running) {
      this._stopTimer();

      return;
    }

    if (name === "reset" && !this.running) {
      this._resetTimer();

      return;
    }

    if (oldValue === newValue) {
      return;
    }
  }

  get running() {
    return this.hasAttribute("running");
  }

  get hideTime() {
    return this.hasAttribute("hide-time");
  }

  set running(value) {
    const isRunning = Boolean(value);
    if (isRunning) this.setAttribute("running", "");
    else this.removeAttribute("running");
  }

  set elpasedTime(value) {
    if(value){
      this.setAttribute("elapsed-time", value);
      return;
    }
    
    this.removeAttribute("elapsed-time");
  }

  _startTimer = () => {
    this.running = true;
    this.removeAttribute("start");

    this.startTime = Date.now();
    this.intervalRef = setInterval(() => {
      const now = Date.now();
      this._setTimerValues(now - this.startTime);
    }, 100);
  };

  _stopTimer = () => {
    const now = Date.now();
    const elapsedTime = now - this.startTime;
    this.running = false;
    clearInterval(this.intervalRef);
    
    this.removeAttribute("stop");
    this._setTimerValues(elapsedTime);
    this.elpasedTime = elapsedTime;
  };

  _resetTimer = () => {
    this.removeAttribute("reset");
    this.elpasedTime = null;
    this._setTimerValues(0);
  };

  _setTimerValues = (elapsedTime) => {
    const milliseconds = parseInt(elapsedTime % 1000);
    const seconds = parseInt((elapsedTime / 1000) % 60);
    const minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
    const hours = parseInt((elapsedTime / (1000 * 60 * 60)) % 24);

    this.$milliseconds.innerHTML =
      "." + milliseconds.toString().padStart(3, "0");
    this.$seconds.innerHTML =
      seconds < 10 && minutes > 0 ? "0" + seconds : seconds;

    if (minutes > 0) {
      this.$minutes.innerHTML =
        minutes < 10 && hours > 0 ? "0" + minutes + ":" : minutes + ":";
    }

    if (hours > 0) {
      this.$$hours.innerHTML = hours + ":";
    }
  };
}

window.customElements.define("component-timer", Timer);
