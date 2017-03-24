import {
  ADD_COMPONENT_SKIN,
  REMOVE_COMPONENT_SKIN,
} from './skin.constants';

export function addSkin(entityId, params) {
  return {
    type: ADD_COMPONENT_SKIN,
    entityId: entityId,
    skin: params,
  };
}

export function removeSkin(entityId) {
  return {
    type: REMOVE_COMPONENT_SKIN,
    entityId: entityId
  };
}
