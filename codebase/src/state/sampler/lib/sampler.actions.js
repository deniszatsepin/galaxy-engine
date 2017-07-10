import {
  SAMPLER__START,
  SAMPLER__UPDATE,
  SAMPLER__STOP,
  SAMPLER__PAUSE,
} from './sampler.constants';

export function startSample(sample) {
  return {
    type: SAMPLER__START,
    sample,
  };
}

export function updateSample(sample) {
  return {
    type: SAMPLER__UPDATE,
    sample,
  };
}
