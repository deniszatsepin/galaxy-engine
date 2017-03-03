export default class Service {

  constructor(params = {}) {
    if (typeof params.name === 'undefined') {
      throw new Error('Service should have a name parameter.');
    }

    this._initialized = false;
    this._scene = null;
    this._store = null;
    this._name = params.name;
    this._priority = params.priority || 100;
  }

  attach(scene) {
    this._scene = scene;
  }

  detach() {
    this._scene = null;
  }

  getName() {
    return this._name;
  }

  initialize(store) {
    this._store = store;
    this._initialized = true;
  }

  terminate() {
    this._initialized = false;
  }

  update(timestamp) {
  }

  get priority() {
    return this._priority;
  }

  get store() {
    return this._store;
  }

  get manager() {
    return this._scene;
  }
}
