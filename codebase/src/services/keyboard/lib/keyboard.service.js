import Service from 'core/service';
import keyCodes from './keycodes';

export default class KeyboardService extends Service {
  constructor(props = {}) {
    props.priority = props.priority || 60;
    props.name = 'keyboard';
    super(props);

    this.actionmap = props.actionmap || keyCodes;
    this.invert = Object.keys(this.actionmap).reduce((acc, action) => {
      acc[this.actionmap[action]] = action;
      return acc;
    }, {});
  }

  initialize(store) {
    super.initialize(store);
    const container = this.manager.getService('container').element;
    if (container) {
      container.addEventListener('keydown', (event) => this.onKeydown(event));
      container.addEventListener('keyup', (event) => this.onKeyup(event));
    }
  }

  onKeydown(event) {
    const keyCode = event.keyCode;
    const action = this.actionmap[keyCode];
    if (action) {
      const state = this.props.state[action];
      if (!state) {
        this.props.startAction(action);
      }
    }
  }

  onKeyup(event) {
    const keyCode = event.keyCode;
    const action = this.actionmap[keyCode];
    if (action) {
      const state = this.props.state[action];
      if (state) {
        this.props.stopAction(action);
      }
    }
  }
}
