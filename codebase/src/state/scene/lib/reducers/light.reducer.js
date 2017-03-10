import {
  ADD_COMPONENT_LIGHT,
  REMOVE_COMPONENT_LIGHT,
  LIGHT_TERN_ON,
  LIGHT_TERN_OFF,
} from '../constants';

export default function light(state = [], action) {
  switch (action.type) {
    case ADD_COMPONENT_LIGHT: {
      return [
        ...state,
        {
          active: action.active || true,
          color: action.color || 0xffffff,
          intensity: action.intensity || 10000,
        }
      ]
    }
    case REMOVE_COMPONENT_LIGHT: {
      return state.filter(light => light !== action.light);
    }
    case LIGHT_TERN_OFF: {
      const light = state.find(light => light === action.light);
      const newState = state.filter(light => light !== action.light);
      newState.push({
        ...light,
        active: false,
      });
      return newState;
    }
    case LIGHT_TERN_ON: {
      const light = state.find(light => light === action.light);
      const newState = state.filter(light => light !== action.light);
      newState.push({
        ...light,
        active: true,
      });
      return newState;
    }
    default: {
      return state;
    }
  }
}
