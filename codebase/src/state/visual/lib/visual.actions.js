import {
  ADD_COMPONENT_VISUAL,
  REMOVE_COMPONENT_VISUAL,
  VISUAL__UPDATE,
} from './visual.constants';

export function addVisual(entityId, visual) {
  return {
    type: ADD_COMPONENT_VISUAL,
    entityId: entityId,
    ...visual,
  };
}

export function removeVisual(entityId, visualId) {
  return {
    type: REMOVE_COMPONENT_VISUAL,
    entityId,
    visualId,
  };
}

export function updateVisual(entityId, visual) {
  return {
    type: VISUAL__UPDATE,
    entityId,
    ...visual,
  };
}
