import {
  ANIMATION_INFO__ADD,
  ANIMATION_INFO__REMOVE
} from './animation-info.constants';

export function addAnimationInfo(name, info) {
  return {
    type: ANIMATION_INFO__ADD,
    name,
    info,
  };
}
