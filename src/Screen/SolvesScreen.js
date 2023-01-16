export default class SolvesScreen {
  constructor() {

  }

  getClassesForMainElement = () => {
    return ["responsive",  "solves-screen"];
  }

  render = () => {
    
    const el = document.createElement("div");
    el.classList.add(...['grid']);

    Array(3).fill(0).forEach(()=> {
      const col = document.createElement('div');
      col.classList.add(...['s1', 'm1', 'l1']);
      col.innerHTML = '<article>Test yo</article>';

      el.appendChild(col);
    });

    return el;
  };
}
