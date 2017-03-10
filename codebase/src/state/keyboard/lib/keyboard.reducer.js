import {
  ACTION__START,
  ACTION__STOP,
  ACTIONS__RESET,
} from './keyboard.constants';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case ACTION__START: {
      return {
        ...state,
        [action.action]: true,
      };
    }
    case ACTION__STOP: {
      return {
        ...state,
        [action.action]: false
      };
    }
    case ACTIONS__RESET: {
      return {
        ...action.actions,
      };
    }
    default: {
      return state;
    }
  }
}
