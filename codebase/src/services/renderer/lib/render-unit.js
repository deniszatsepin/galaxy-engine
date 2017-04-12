import createGeometry from 'gl-geometry';
import createShader from 'gl-shader';
import createTexture from 'gl-texture2d';

const shaders = {};
let materialMounted = 0;

export default class RenderUnit {
  constructor(params = {}) {
    this._geometryInfo = params.geometry;
    this._materialInfo = params.material;
    this._skinInfo = params.skin;
    this._materialParams = Object.keys(params.material)
      .filter(key => key !== 'fragmentShader' && key !== 'vertexShader')
      .reduce((acc, key) => Object.assign({}, {
        [`${key}`]:params.material[key]
      }), {});
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
      weight,
      joint,
    } = this._geometryInfo;
    const indeces = faces || cells;
    const geometry = this._geometry = createGeometry(gl);

    if (positions) {
      geometry.attr('positions', positions);
    }

    if (normals) {
      geometry.attr('normals', normals);
    }

    if (uvs) {
      geometry.attr('uvs', uvs, {
        size: 2,
      });
    }

    if (joint) {
      geometry.attr('joint', joint);
    }

    if (weight) {
      geometry.attr('weight', weight);
    }

    if (indeces) {
      geometry.faces(indeces);
    }

    const {
      vertexShader,
      fragmentShader,
      diffuse,
    } = this._materialInfo;

    if (diffuse) {
      const texture = this._texture = createTexture(gl, diffuse.source);
    }

    //TODO: calculate hash here
    const key = vertexShader + fragmentShader;
    this._material = shaders[key] = shaders[key] ||
      createShader(gl, vertexShader, fragmentShader);

    this._realized = true;
  }

  render(data) {
    const params = Object.assign({}, data, this._materialParams, {
      jointMat: this._skinInfo ? this._skinInfo.matrices : undefined,
    });
    if (!this._realized) return;
    const geometry = this._geometry;
    const material = this._material;
    const uniforms = material.uniforms;
    const attributes = material.attributes;
    material.bind();
    Object.keys(uniforms).forEach(key => {
        uniforms[key] = params[key];
    });

    if (typeof uniforms.texture !== 'undefined' && this._texture) {
      uniforms.texture = this._texture.bind();
    }
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
