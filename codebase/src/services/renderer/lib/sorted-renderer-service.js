'use strict';

import { vec3, mat4, quat } from 'gl-matrix';

import Service from 'core/service';

import SceneNode from './scene-node';
import RenderUnit from './render-unit';
import LightSource from './light-source';

const CANVAS_STYLE_DEFAULT = {
  position: 'absolute',
  left: '0px',
  top: '0px',
}

export default class SortedRendererService extends Service {
  constructor(params = {}) {
    params.name = 'renderer';
    super(params);
    this._contextOptoins = params.glOptions || {};
    this._camera = params.camera || new DefaultCamera();
    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();
    this._params = params;
    this.renderables = null;
  }

  initialize(store) {
    super.initialize(store);

    this.createCanvas();
    const gl = this._gl =
      this._canvas.getContext('webgl', this._contextOptoins) ||
      this._canvas.getContext('experimantal-webgl', this._contextOptions);

    if (!gl) {
      throw new Error('Unable to initialize WebGL.');
    }

    const camera = this._camera;
    mat4.perspective(
      this._projectionMatrix,
      camera.fovy,
      this._canvas.width / this._canvas.height,
      camera.near,
      camera.far
    );

    this._lights = [];
    const state = this._prevState = this._store.getState().scene;
    const root = state.rootId ? state[state.rootId] : null;
    if (root) {
      this.traverse(state);
    }

    if (this.renderables) {
      this.realize({
        gl: this._gl,
      });
    }

    const params = this._params;
    this._clearFlags = params.clearFlags === undefined ? (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) : params.clearFlags;
    this._clearColor = params.clearColor || [0,0,0,1];
    this._clearDepth = params.clearDepth || 1.0;
    this._clearStencil = params.clearStencil || 0;

    this.prevTimestamp = 0;
    this.deltas = 0;
    this.frames = 0;
  }

  fps(timestamp) {
    const delta = timestamp - this.prevTimestamp;
    this.prevTimestamp = timestamp;
    this.deltas += delta;
    this.frames += 1;
    if (this.deltas > 1000) {
      console.log('frames: ', this.frames);
      this.deltas = 0;
      this.frames = 0;
    }
  }

  getViewMatrix() {
    const scene = this._store.getState().scene;
    const camera = scene[scene.cameraId];
    return camera.transform.worldMatrixInvert;
  }

  update(timestamp) {
    super.update(timestamp);
    this.fps(timestamp);

    //TODO: should be replaced with information from camera.
    //mat4.lookAt(this._viewMatrix, [40, 40, 40], [0, 0, 0], [0, 1, 0]);
    this.prerender();

    // let angle = (timestamp / 2000) % (Math.PI * 2);
    // mat4.rotateY(tempMat4, this._viewMatrix, angle);
    // mat4.copy(this._viewMatrix, tempMat4);

    if (this.renderables) {
      this.updateGraph();
      mat4.copy(this._viewMatrix, this.getViewMatrix());
      this.render();
    } else {
      const state = this._prevState = this._store.getState().scene;
      const root = state.rootId ? state[state.rootId] : null;
      if (root) {
        this.traverse(state);
      }

      if (this.renderables) {
        this.realize({
          gl: this._gl,
        });
      }
    }
  }

  prerender() {
    const gl = this._gl;
    //Bind default framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //Set viewport
    gl.viewport(0, 0, this._canvas.width || 0, this._canvas.height || 0);

    //Clear buffers
    if(this._clearFlags & gl.STENCIL_BUFFER_BIT) {
      gl.clearStencil(this._clearStencil);
    }
    if(this._clearFlags & gl.COLOR_BUFFER_BIT) {
      gl.clearColor(this._clearColor[0], this._clearColor[1], this._clearColor[2], this._clearColor[3]);
    }
    if(this._clearFlags & gl.DEPTH_BUFFER_BIT) {
      gl.clearDepth(this._clearDepth);
    }
    if(this._clearFlags) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    // Enables depth testing, which prevents triangles
    // from overlapping.
    gl.enable(gl.DEPTH_TEST)

    // Enables face culling, which prevents triangles
    // being visible from behind.
    gl.enable(gl.CULL_FACE)
  }

  render() {
    for (let key in this.renderables) {
      this.renderables[key].update({
        viewMatrix: this._viewMatrix,
        projectionMatrix: this._projectionMatrix,
        lightPosition: this._lights[0]? this._lights[0].position : undefined,
      });
    }
  }

  realize(params) {
    for (let key in this.renderables) {
      this.renderables[key].realize(params);
    }
    this._realized = true;
  }

  createCanvas() {
    const container = this._container = this._scene.getService('container');

    if (!container) {
      throw new Error('Container service not found.');
    }

    const size = container.size;
    const canvas = this._canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    applyStyles(canvas, {
      width: size.width + 'px',
      height: size.height + 'px',
    });
    container.appendChild(canvas);
    applyStyles(canvas, CANVAS_STYLE_DEFAULT);
  }

  updateGraph() {
    const state = this.store.getState().scene;
    const keys = Object.keys(state);
    keys.forEach(key => {
      if (key === 'rootId' || key === 'cameraId') return;

      const prev = this._prevState[key];
      const next = state[key];
      if (prev && next && prev !== next && prev.transform !== next.transform) {
        const node = this.getNodeByEntityUUID(next.entityId);
        for (key in next.transform) {
          let val = next.transform[key];
          if (val) {
            node[key] = val;
          }
        }
      }
    });

    const prevKeys = Object.keys(this._prevState);
    const newKeys = prevKeys.reduce(
      (keys, oldKey) => keys.filter(
        key => key !== oldKey
      ),
      keys
    );

    if (newKeys.length) {
      this.traverse(state, newKeys);
    }
    this._prevState = state;
  }

  traverse(state, newKeys) {
    const keys = newKeys || Object.keys(state);
    const entities = keys
      .filter(key => key !== 'rootId' && key !== 'cameraId')
      .map(key => state[key]);

    this.renderables = entities.reduce((acc, entity) => {
      const sceneNode = new SceneNode({
        entity: entity.entityId,
        ...entity.transform,
      });
      const renderUnits = entity.visual.map(visual => new RenderUnit({
        geometry: visual.geometry,
        material: visual.material,
        skin: visual.skin,
      }));
      sceneNode.addRenderUnits(renderUnits);

      if (entity.light && entity.light.length) {
        entity.light.forEach(lightInfo => {
          this._lights.push(new LightSource(lightInfo, sceneNode));
        });
      }

      acc[entity.entityId] = sceneNode;
      return acc;
    }, this.renderables || {});

    if (newKeys && this._realized) {
      newKeys.forEach(key => this.renderables[key].realize({
        gl: this._gl,
      }));
    }
  }

  getNodeByEntityUUID(uuid) {
    return this.renderables[uuid];
  }
}

function getStateRoot(state) {
  return state.rootId ? state[state.rootId] : undefined;
}

class DefaultCamera {
  constructor(params = {}) {
    this.fovy = params.fovy || 60 * (Math.PI / 180);
    this.aspect = params.aspect || 1;
    this.near = params.near || .1;
    this.far = params.far || 1000;
  }
}

function applyStyles(element, styles) {
  Object.keys(styles).forEach(style => {
    element.style[style] = styles[style];
  });
}
