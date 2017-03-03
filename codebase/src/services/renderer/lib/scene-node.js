/**
 * Created by denis.zatsepin on 10/12/2016.
 */
'use strict';

import { vec3, vec4, mat3, mat4, quat } from 'gl-matrix';
import RenderUnit from './render-unit';

const tempMatrix1 = mat4.create();
const tempMatrix2 = mat4.create();

export default class SceneNode {
  constructor(params = {}) {
    this.entityId = params.entityId || null;
    this.position = params.position || vec3.create();
    this.quaternion = params.quaternion || quat.create();
    this.localMatrix = params.localMatrix || mat4.create();
    this.worldMatrix = params.worldMatrix || mat4.create();
    this.worldMatrixInvert = params.worldMatrixInvert || mat4.create();
    this.normalMatrix = params.normalMatrix || mat3.create();
    this.renderable = false;
    this.renderUnits = [];
    this.lightPosition = vec3.create();
  }

  get worldPosition() {
    const position = vec3.create();
    vec3.transformMat4(position, this.position, this.worldMatrix);
    return position;
  }

  addRenderUnit(unit) {
    if (!(unit instanceof RenderUnit)) return;

    const idx = this.renderUnits.indexOf(unit);
    if (idx < 0) {
      this.renderUnits.push(unit);
      this.renderable = true;
    }
  }

  addRenderUnits(units) {
    units.forEach(unit => this.addRenderUnit(unit));
  }

  removeRenderUnit(unit) {
    const idx = this.renderUnits.indexOf(unit);
    if (idx >= 0) {
      this.renderUnits.splice(idx, 1);
      if (!this.renderUnits.length) {
        this.renderable = false;
      }
    }
  }

  realize(params = {}) {
    this.renderUnits.forEach(unit => unit.realize(params));
  }

  update(params) {
    this.render(params);
  }

  render(params) {
    if (!this.renderable) return;

    mat4.multiply(tempMatrix1, params.viewMatrix, this.worldMatrix);
    mat4.invert(tempMatrix2, tempMatrix1);
    mat4.transpose(tempMatrix1, tempMatrix2);
    mat3.fromMat4(this.normalMatrix, tempMatrix1);
    if (params.lightPosition) {
      vec3.transformMat4(this.lightPosition, params.lightPosition, this.worldMatrixInvert);
    }

    const renderParams = Object.assign({}, params, {
      modelMatrix: this.worldMatrix,
      normalMatrix: this.normalMatrix,
      lightPosition: this.lightPosition
    });
    this.renderUnits.forEach(unit => unit.render(renderParams));
  }
}
