'use strict';

import createGeometry from 'gl-geometry';
import createShader from 'gl-shader';

const shaders = {};
let materialMounted = 0;

export default class RenderUnit {
  constructor(params = {}) {
    this._geometryInfo = params.geometry;
    this._materialInfo = params.material;
    this._materialParams = Object.keys(params.material)
      .filter(key => key !== 'fragmentShader' && key !== 'vertexShader')
      .reduce((acc, key) => {acc[key] = params.material[key]; return acc;}, {});
    this._geometry = null;
    this._material = null;
    this._hidden = params.hidden || false;
    this._realized = false;
  }

  realize(params = {}) {
    const gl = this._gl = params.gl;
    const {
      positions,
      normals,
      faces,
      cells,
      uvs,
    } = this._geometryInfo;
    const indeces = faces || cells;
    const geometry = this._geometry = createGeometry(gl);

    if (positions) {
      geometry.attr('positions', positions);
    }

    if (normals) {
      geometry.attr('normals', normals);
    }

    if (indeces) {
      geometry.faces(indeces);
    }

    const {
      vertexShader,
      fragmentShader,
    } = this._materialInfo;

    const key = vertexShader + fragmentShader;
    this._material = shaders[key] = shaders[key] ||
      createShader(gl, vertexShader, fragmentShader);

    this._realized = true;
  }

  render(data) {
    const params = Object.assign({}, data, this._materialParams);
    if (!this._realized) return;
    const geometry = this._geometry;
    const material = this._material;
    const uniforms = material.uniforms;
    const attributes = material.attributes;
    material.bind();
    Object.keys(uniforms).forEach(key => {
        uniforms[key] = params[key];
    });
    // uniforms.modelMatrix = params.modelMatrix;
    // uniforms.viewMatrix = params.viewMatrix;
    // uniforms.projectionMatrix = params.projectionMatrix;
    // uniforms.normalMatrix = params.normalMatrix;
    // uniforms.lightPosition = params.lightPosition;
    // uniforms.lightColor = params.lightColor;
    geometry.bind();
    geometry._keys.forEach((key, idx) => {
      const attr = attributes[key];
      if (attr) {
        attr.location = idx;
      }
    });
    const mode = this._geometryInfo.mode;
    geometry.draw(mode ? this._gl[mode] : undefined);
    geometry.unbind();
  }
}
