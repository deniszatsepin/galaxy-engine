import {
  ANIMATION_INFO__ADD,
  ANIMATION_INFO__REMOVE
} from './animation-info.constants';

export default function animationInfoReducer(state = {}, {
  type,
  name,
  info
}) {
  switch (type) {
    case ANIMATION_INFO__ADD: {
      return {
        ...state,
        [name]: {
          ...info,
        },
      };
    }
    default:
      return state;
  }
}
