import {
  ADD_COMPONENT_VISUAL,
  REMOVE_COMPONENT_VISUAL,
  VISUAL__UPDATE,
} from './visual.constants';

export default function visual(state = [], action) {
  switch(action.type) {
    case ADD_COMPONENT_VISUAL: {
      return [
        ...state,
        {
          ...Object.keys(action)
            .filter(key => key !== 'type' && key !== 'entityId')
            .reduce((acc, key) => { acc[key] = action[key]; return acc; }, {})
        },
      ];
    }
    case REMOVE_COMPONENT_VISUAL: {
      return state.filter(visual => visual.visualId !== action.visualId);
    }
    case VISUAL__UPDATE: {
      return [
        ...state.filter(visual => visual.visualId !== action.visualId),
        {
          ...Object.keys(action)
            .filter(key => key !== 'type' && key !== 'entityId')
            .reduce((acc, key) => {
              return {
                ...acc,
                [`${key}`]: action[key],
              };
            }, {}),
        }
      ]
    }
    default: {
      return state;
    }
  }
}
