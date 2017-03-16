'use strict';

import {
  ADD_COMPONENT_TARGET,
  REMOVE_COMPONENT_TARGET,
} from './target.constants';

export default function target(state = null, action) {
  switch(action.type) {
    case ADD_COMPONENT_TARGET: {
      return action.targetId;
    }
    case REMOVE_COMPONENT_TARGET: {
      return null;
    }
    default: {
      return state;
    }
  }
}
