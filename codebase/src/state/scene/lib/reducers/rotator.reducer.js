import {
  ADD_COMPONENT_ROTATOR,
  REMOVE_COMPONENT_ROTATOR,
} from '../constants';

export default function rotator(state = {}, action) {
  switch (action.type) {
    case ADD_COMPONENT_ROTATOR: {
      return {
        axis: action.axis,
        rad: action.rad
      };
    }
    case REMOVE_COMPONENT_ROTATOR: {
      return state.filter(element => element !== action.rotator);
    }
    default: {
      return state;
    }
  }
}
