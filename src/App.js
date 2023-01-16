import Event from "./Eventing/Event.js";
import EventDispatcher from "./Eventing/EventDispatcher.js";
import KeyPress from "./Eventing/KeyPress.js";
import PageNotFoundScreen from "./Screen/PageNotFoundScreen.js";
import SolvesScreen from "./Screen/SolvesScreen.js";
import TimerScreen from "./Screen/TimerScreen.js";
import Settings from "./Settings.js";

export default class App {
  static longPressDelayInMs = 1000;

  constructor(mainElement) {
    this.mainElement = mainElement;

    this.keysLongPressed = {};
    this.keysPressed = {};
    this.timeoutRef = null;
  }

  bootstrap = () => {
    this._bindEventListeners();
    this._initializeSettings();

    const that = this;
    const router = new Router({
      mode: "hash",
      root: "/",
      page404: function () {
        const screen = new PageNotFoundScreen();
        that.mainElement.innerHTML = "";
        that.mainElement.appendChild(screen.render());
      },
    });

    router
      .add("", function () {
        const screen = new TimerScreen();
        that.mainElement.innerHTML = "";
        that.mainElement.appendChild(screen.render());
      })
      .add("solves", function () {
        const screen = new SolvesScreen();
        that.mainElement.innerHTML = "";
        that.mainElement.appendChild(screen.render());
      })
      .check()
      .addUriListener();

    window.router = router;
  };

  _initializeSettings = async () => {
    document.querySelectorAll("component-setting").forEach((setting) => {
      if (Settings.get(setting.getAttribute("id"))) {
        setting.setAttribute("checked", "");
      }
    });

    if (Settings.applyDarkMode()) {
      ui("mode", "dark");
    }

    const theme = Settings.getTheme();
    await ui("theme", theme.color);
    document
      .querySelector("component-theme-picker")
      .setAttribute("selected-theme", theme.name);
  };

  _bindEventListeners = () => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    const keyDown = isTouch ? "touchstart" : "keydown";
    const keyUp = isTouch ? "touchend" : "keyup";

    document.addEventListener(Event.timerIsReady, () => {
      if (!Settings.hideElementsWhenTiming()) {
        return;
      }
      document.body.classList.add(...["fullscreen"]);
    });

    document.addEventListener(Event.timerWasStopped, () => {
      if (!Settings.hideElementsWhenTiming()) {
        return;
      }
      document.body.classList.remove("fullscreen");
    });

    document.addEventListener(Event.settingWasUpdated, (e) => {
      if (e.detail.id === "applyDarkMode") {
        e.detail.isChecked ? ui("mode", "dark") : ui("mode", "light");
      }
    });
    document.addEventListener(Event.themeWasUpdated, async (e) => {
      await ui("theme", e.detail.color);
    });

    document.addEventListener(keyDown, (e) => {
      if (e.key in this.keysPressed) {
        return;
      }

      this.keysPressed[e.key] = true;

      if (KeyPress.isS(e)) {
        ui("#settings");
      }

      this.timeoutRef = setTimeout(() => {
        this.keysLongPressed[e.key] = true;
        EventDispatcher.dispatch(Event.onLongKeyDown, { e });

        this._cancelEvent(e);
      }, App.longPressDelayInMs);
    });

    document.addEventListener(keyUp, (e) => {
      clearTimeout(this.timeoutRef);
      if (e.key in this.keysLongPressed) {
        delete this.keysLongPressed[e.key];
        EventDispatcher.dispatch(Event.onLongKeyUp, { e });

        this._cancelEvent(e);
      }
      delete this.keysPressed[e.key];
    });
  };

  _cancelEvent = (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
  };
}
