import Event from "../Eventing/Event.js";
import KeyPress from "../Eventing/KeyPress.js";
import EventDispatcher from "../Eventing/EventDispatcher.js";
import Utils from "../Utils.js";
import Settings, { HIDE_TIME_WHILE_SOLVING } from "../Settings.js";
import Solves from "../Solves.js";

export default class TimerScreen {
  constructor() {
    this.intervalRef = null;
    this.timer = null;
  }

  getClassesForMainElement = () => {
    return ["responsive", "timer-screen"];
  };

  render = () => {
    const randomScramble = Utils.randomScramble(20);
    const scrambleElement = document.createElement("component-scramble");
    scrambleElement.setAttribute("algorithm", randomScramble);

    const timerElement = document.createElement("component-timer");
    timerElement.setAttribute("reset", "");
    if (Settings.hideTimeWhileSolving()) {
      timerElement.setAttribute("hide-time", "");
    }

    document.addEventListener(Event.settingWasUpdated, (e) => {
      if (e.detail.id === HIDE_TIME_WHILE_SOLVING) {
        e.detail.isChecked
          ? timerElement.setAttribute("hide-time", "")
          : timerElement.removeAttribute("hide-time");
      }
    });

    document.addEventListener(Event.onLongKeyDown, (e) => {
      if (!KeyPress.isSpaceBar(e.detail.e)) {
        return;
      }

      EventDispatcher.dispatch(Event.timerIsReady);
      timerElement.setAttribute("reset", "");
      timerElement.classList.add(...["green-text"]);
    });

    document.addEventListener(Event.onLongKeyUp, (e) => {
      if (!KeyPress.isSpaceBar(e.detail.e)) {
        return;
      }

      if (!timerElement.hasAttribute("running")) {
        EventDispatcher.dispatch(Event.timerWasStarted);

        timerElement.setAttribute("start", "");
        timerElement.classList.remove("green-text");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!(KeyPress.isSpaceBar(e) || KeyPress.isEsc(e))) {
        return;
      }

      if (timerElement.hasAttribute("running")) {
        EventDispatcher.dispatch(Event.timerWasStopped);
        timerElement.setAttribute("stop", "");

        Solves.add({
          uuid: Utils.uuidv4(),
          timeInMilliseconds: parseInt(
            timerElement.getAttribute("elapsed-time")
          ),
          solvedOn: Date.now(),
          scramble: scrambleElement.getAttribute("algorithm"),
        });

        const randomScramble = Utils.randomScramble(20);
        scrambleElement.setAttribute("algorithm", randomScramble);
      }
    });

    const el = document.createElement("div");
    el.appendChild(scrambleElement);
    el.appendChild(timerElement);

    return el;
  };
}
