import {
  ENTITY_CREATE,
  ENTITY_DELETE,
  ENTITY_ADD,
  ENTITY_REMOVE,
  ENTITY_SET_ROOT,
  SCENE__SET_CAMERA,
} from '../constants';

export function createEntity(entityId) {
  return {
    type: ENTITY_CREATE,
    entityId,
  };
}

export function deleteEntity(entityId) {
  return {
    type: ENTITY_DELETE,
    entityId,
  };
}

export function addEntityChild(entityId, childId) {
  return {
    type: ENTITY_ADD,
    entityId,
    childId,
  };
}

export function removeEntityChild(entityId, childId) {
  return {
    type: ENTITY_REMOVE,
    entityId,
    childId,
  };
}

export function setRootEntity(entityId) {
  return {
    type: ENTITY_SET_ROOT,
    entityId,
  };
}

export function setCamera(entityId) {
  return {
    type: SCENE__SET_CAMERA,
    entityId,
  };
}
