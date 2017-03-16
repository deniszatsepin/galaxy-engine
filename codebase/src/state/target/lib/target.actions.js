import * as constants from './target.constants';

export function setTarget(entityId, targetId) {
  return {
    type: constants.ADD_COMPONENT_TARGET,
    entityId: entityId,
    targetId: targetId,
  };
}

export function removeTarget(entityId) {
  return {
    type: constants.REMOVE_COMPONENT_TARGET,
    entityId: entityId,
  };
}
