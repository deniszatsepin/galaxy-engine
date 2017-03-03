/**
 * Created by denis.zatsepin on 09/12/2016.
 */
'use strict';

import {
  requestFrame,
  cancelFrame
} from 'utils/request-frame';

import Service from 'core/service';

export default class ServiceManager {

  constructor(store) {
    this._running = false;
    this._servicesInitialized = false;
    this._services = [];
    this._servicesHash = {};
    this._store = store;
  }

  addService(service) {
    if (!(service instanceof Service)) {
      throw new Error('Each service should be an instance of Service class');
    }

    const idx = this._services.indexOf(service);
    if (idx < 0) {
      this._services.push(service);
      this._servicesHash[service.getName()] = service;
      service.attach(this);
      this._services.sort((a, b) => {
        return a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0;
      });
      if (this._servicesInitialized) {
        service.initialize(this._store);
      }
    }
  }

  removeService(service) {
    const idx = this._services.indexOf(service);
    if (idx >= 0) {
      this._services.splice(idx, 1);
      delete this._servicesHash[service.getName()];
      service.detach();
    }
  }

  getService(name) {
    return this._servicesHash[name];
  }

  initialize() {
    this.initializeServices();
  }

  initializeServices() {
    this._services.forEach(service => service.initialize(this._store));
    this._servicesInitialized = true;
  }

  run() {
    this.initialize();
    this._running = true;
    this.loop(0);
  }

  stop() {
    this.terminate();
    this._running = false;
    if (this.frameId) {
      cancelFrame(this.frameId);
      this.frameId = 0;
    }
  }

  loop(timestamp) {
    this.frameId = requestFrame(this.loop.bind(this));
    this._services.forEach(service => service.update(timestamp));
  }
}
