import * as constants from './light.constants';

export function addLight(entityId, params) {
  const light = Object.assign({
    active: true,
    color: 0xffffff,
    intensity: 10000,
  }, params);

  return {
    type: constants.ADD_COMPONENT_LIGHT,
    entityId: entityId,
    ...light,
  };
}

export function removeLight(entityId, light) {
  return {
    type: constants.REMOVE_COMPONENT_LIGHT,
    entityId: entityId,
    light: light,
  };
}

export function ternLightOn(entityId, light) {
  return {
    type: constants.LIGHT__TERN_OFF,
    entityId: entityId,
    light: light,
  };
}

export function ternLightOff(entityId, light) {
  return {
    type: constants.LIGHT__TERN_ON,
    entityId: entityId,
    light: light,
  };
}
