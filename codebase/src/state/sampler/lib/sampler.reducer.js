import {
  SAMPLER__START,
  SAMPLER__STOP,
  SAMPLER__UPDATE,
  SAMPLER__PAUSE,
} from './sampler.constants';

export default function samplerReducer(state = [], action) {
  switch (action.type) {
    case SAMPLER__START: {
      return [
        ...state,
        action.sample,
      ]
    }
    case SAMPLER__UPDATE: {
      const next = state.filter(el => el.id !== action.sample.id);
      return [
        ...next,
        action.sample,
      ]
    }
    default:
      return state;
  }
}
