import {
  ADD_COMPONENT_LIGHT,
  REMOVE_COMPONENT_LIGHT,
  LIGHT__TERN_ON,
  LIGHT__TERN_OFF,
} from './light.constants';

export default function light(state = [], action) {
  switch (action.type) {
    case ADD_COMPONENT_LIGHT: {
      return [
        ...state,
        Object.assign(
          {},
          Object.keys(action)
            .filter(key => key !== 'type' && key !== 'entityId')
            .reduce((acc, key) => { acc[key] = action[key]; return acc; }, {})
        )
      ];
    }
    case REMOVE_COMPONENT_LIGHT: {
      return state.filter(light => light !== action.light);
    }
    case LIGHT__TERN_OFF: {
      const light = state.find(light => light === action.light);
      const newState = state.filter(light => light !== action.light);
      newState.push({
        ...light,
        active: false,
      });
      return newState;
    }
    case LIGHT__TERN_ON: {
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
