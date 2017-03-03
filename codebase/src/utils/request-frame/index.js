'use strict';

let time = 0;

module.exports = {
  requestFrame: getRequestFrame(),
  cancelFrame: getCancelFrame()
};

function getRequestFrame() {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame
  }

  time = process.hrtime();
  return requestFrame;
}

function getCancelFrame() {
  if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    return window.cancelAnimationFrame;
  }

  return cancelFrame;
}

function requestFrame(callback) {
  return setImmediate(() => {
    const diff = process.hrtime(time);
    callback((diff[0] * 1e9 + diff[1]) * 1e-6);
  });
}

function cancelFrame(id) {
  return clearImmediate(id);
}
