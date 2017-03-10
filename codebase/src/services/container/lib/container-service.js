import Service from 'core/service';

const DEFAULT_CONTAINER_STYLE = {
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
  height: '100%',
  overflow: 'hidden',
};

const DEFAULT_BODY_STYLE = {
  overflow: 'hidden', //Prevent bounce
  height: '100%',
};

export default class ContainerService extends Service {
  constructor(params = {}) {
    params.priority = params.priority || 10;
    params.name = 'container';
    super(params);

    this._element = null;
  }

  initialize() {
    this._element = makeDefaultContainer();
    super.initialize();
    this._element.focus();
  }

  appendChild(child) {
    if (this._element) {
      return this._element.appendChild(child);
    }
  }

  removeChild(child) {
    if (this._element) {
      return this._element.removeChild(child);
    }
  }

  get size() {
    return {
      width: this._element.clientWidth,
      height: this._element.clientHeight
    };
  }

  get element() {
    return this._element;
  }

  get offset() {
    const rect = this._element.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }
}

function makeDefaultContainer() {
  const container = document.createElement('div');
  applyStyles(container, DEFAULT_CONTAINER_STYLE);
  document.body.appendChild(container);
  applyStyles(document.body, DEFAULT_BODY_STYLE);
  container.setAttribute('tabindex', 1);
  return container;
}

function applyStyles(element, styles) {
  Object.keys(styles).forEach(style => {
    element.style[style] = styles[style];
  });
}
