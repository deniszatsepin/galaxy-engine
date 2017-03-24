import {
  ADD_COMPONENT_SKIN,
  REMOVE_COMPONENT_SKIN,
} from './skin.constants';

export default function skin(state = {}, action) {
  switch(action.type) {
    case ADD_COMPONENT_SKIN: {
      return {
        ...state,
        ...action.skin,
      };
    }
    case REMOVE_COMPONENT_SKIN: {
      return {};
    }
    default: {
      return state;
    }
  }
}
