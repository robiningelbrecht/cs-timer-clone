const CACHE_KEY = "settings";
export const APPLY_DARK_MODE = "applyDarkMode";
export const HIDE_ELEMENTS_WHEN_TIMING = "hideElementsWhenTiming";
export const HIDE_TIME_WHILE_SOLVING = "hideTimeWhileSolving";
export const THEME = "theme";

const SETTINGS_DEFAULTS = {
  [APPLY_DARK_MODE]: true,
  [HIDE_ELEMENTS_WHEN_TIMING]: true,
  [HIDE_TIME_WHILE_SOLVING]: false,
  [THEME]: {
    name: "deep-purple",
    color: "#673ab7",
  },
};

export default class Settings {
  static get = (id) => {
    const cache = Settings.__get(CACHE_KEY);
    if (!SETTINGS_DEFAULTS.hasOwnProperty(id)) {
      throw new Error("Trying to get non-existing setting " + id);
    }

    let settings = {
      ...SETTINGS_DEFAULTS,
      ...cache,
    };

    return settings[id];
  };

  static applyDarkMode = () => {
    return Settings.get(APPLY_DARK_MODE);
  };

  static getTheme = () => {
    return Settings.get(THEME);
  };

  static hideElementsWhenTiming = () => {
    return Settings.get(HIDE_ELEMENTS_WHEN_TIMING);
  };

  static hideTimeWhileSolving = () => {
    return Settings.get(HIDE_TIME_WHILE_SOLVING);
  };

  static set = (id, data) => {
    const cache = Settings.__get(CACHE_KEY);
    cache[id] = data;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  };

  static __get = (key) => {
    return JSON.parse(window.localStorage.getItem(key)) || {};
  };
}
