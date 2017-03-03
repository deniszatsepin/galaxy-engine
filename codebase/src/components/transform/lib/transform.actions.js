import * as constants from './transform.constants';

export function addTransform(entityId, transform) {
  return {
    type: constants.ADD_COMPONENT_TRANSFORM,
    entityId: entityId,
    ...transform,
  };
}

export function removeTransform(entityId) {
  return {
    type: constants.REMOVE_COMPONENT_TRANSFORM,
    entityId: entityId,
  };
}

export function setPosition(entityId, position) {
  return {
    type: constants.TRANSFORM__SET_POSITION,
    entityId: entityId,
    position,
  };
}

export function setQuaternion(entityId, quaternion) {
  return {
    type: constants.TRANSFORM__SET_QUATERNION,
    entityId: entityId,
    quaternion,
  };
}

export function updateMatrices(entityId, matrices) {
  return {
    type: constants.TRANSFORM__UPDATE_MATRICES,
    entityId,
    ...matrices,
  };
}
