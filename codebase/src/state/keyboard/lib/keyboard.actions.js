import {
  ACTION__START,
  ACTION__STOP,
  ACTIONS__RESET,
} from './keyboard.constants';

export function startAction(action) {
  return {
    type: ACTION__START,
    action,
  };
}

export function stopAction(action) {
  return {
    type: ACTION__STOP,
    action,
  };
}

export function resetActions(actions) {
  return {
    type: ACTIONS__RESET,
    actions,
  };
}
