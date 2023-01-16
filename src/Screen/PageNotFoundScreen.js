export default class PageNotFoundScreen {
    constructor() {
  
    }
  
    render = () => {
      const el = document.createElement("div");
      el.innerHTML = '<h1>Lost you way?</h1><p>Sorry, we cannot find that page...</p>';
      return el;
    };
  }
  