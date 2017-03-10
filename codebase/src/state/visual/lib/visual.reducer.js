'use strict';

import {
  ADD_COMPONENT_VISUAL,
  REMOVE_COMPONENT_VISUAL,
} from './visual.constants';

export default function visual(state = [], action) {
  switch(action.type) {
    case ADD_COMPONENT_VISUAL: {
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
    case REMOVE_COMPONENT_VISUAL: {
      return state.filter(visual => visual !== action.visual);
    }
    default: {
      return state;
    }
  }
}
