import Solves from "../Solves.js";

export default class SolvesScreen {
  constructor() {}

  getClassesForMainElement = () => {
    return ["responsive", "solves-screen"];
  };

  render = () => {
    const el = document.createElement("div");
    el.classList.add(...["grid"]);

    const solves = Solves.get();
    solves
      .sort((a, b) => b.solvedOn - a.solvedOn)
      .forEach((solve) => {
        const col = document.createElement("div");
        col.classList.add(...["s4", "m2", "l2"]);
        col.innerHTML = `<component-solve uuid="${solve.uuid}" solved-on="${solve.solvedOn}" time-in-milli-seconds="${solve.timeInMilliseconds}" scramble="${solve.scramble}"></component-solve>`;

        el.appendChild(col);
      });

    return el;
  };
}
