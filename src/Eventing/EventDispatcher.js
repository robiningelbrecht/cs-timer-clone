export default class EventDispatcher {
  static dispatch = (evetName, params) => {
    document.dispatchEvent(new CustomEvent(evetName, { detail: params || {} }));
  };
}
