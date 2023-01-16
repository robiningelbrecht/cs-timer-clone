const CACHE_KEY = "solves";

export default class Solves {
  static get = () => {
    return Solves.__get(CACHE_KEY);
  };

  static add = (solve) => {
    const sloves = Solves.__get(CACHE_KEY);

    ["uuid", "timeInMilliseconds", "solvedOn", "scramble"].forEach((key) => {
      if (!solve.hasOwnProperty(key)) {
        throw new Error("Required key " + key + " no set");
      }
    });

    sloves.push(solve);
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(sloves));
  };

  static __get = (key) => {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  };
}
