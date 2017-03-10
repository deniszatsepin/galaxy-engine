import * as constants from './visual.constants';

export function addVisual(entityId, params) {
  return {
    type: constants.ADD_COMPONENT_VISUAL,
    entityId: entityId,
    ...params,
  };
}

export function removeVisual(entityId, visual) {
  return {
    type: constants.REMOVE_COMPONENT_VISUAL,
    entityId: entityId,
    visual: visual,
  };
}
