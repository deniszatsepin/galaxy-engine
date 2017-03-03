import {
  vec3,
  mat4,
} from 'gl-matrix';

export default class LightSource {
  constructor(lightInfo, sceneNode) {
    this._info = lightInfo;
    this._sceneNode = sceneNode;
  }

  get position() {
    return this._sceneNode.worldPosition;
  }
}
