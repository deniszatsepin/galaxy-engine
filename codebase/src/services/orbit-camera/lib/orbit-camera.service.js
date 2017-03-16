import { vec3, mat3, mat4, quat } from 'gl-matrix';

import Service from 'core/service';

const _lookAtMatrix = mat3.create();
const _quaternion = quat.create();
const _dz = vec3.create();
const _dx = vec3.create();
const _dy = vec3.create();
const _pTarget = vec3.create();

export default class OrbitCameraService extends Service {
  constructor(params = {}) {
    params.priority = params.priority || 160;
    params.name = 'orbit-camera';
    super(params);
    this.prevCamera = null;
    this.prevKeyboard = null;
  }

  initialize(store) {
    super.initialize(store);
  }

  update(timestamp) {
    const state = this.store.getState();
    const {
      scene,
      keyboard
    } = state;
    const cameraId = scene.cameraId;

    if (!cameraId) return;

    const camera = scene[cameraId];

    if (camera === this.prevCamera && keyboard === this.prevKeyboard) {
      return;
    }

    this.prevCamera = camera;
    this.prevKeyboard = keyboard;

    const {
      parentId,
      target,
      transform: {
        position,
        quaternion,
      }
    } = camera;
    const {
      transform: {
        worldMatrixInvert: parentInvert,
      }
    } = scene[parentId];

    if (target && position) {
      vec3.transformMat4(_pTarget, target, parentInvert);
      vec3.subtract(_dz, position, _pTarget);
      vec3.normalize(_dz, _dz);
      vec3.cross(_dx, [0, 1, 0], _dz);
      vec3.normalize(_dx, _dx);
      vec3.cross(_dy, _dz, _dx);
      vec3.normalize(_dy, _dy);

      if (keyboard.w) {
        this.zoom(
          cameraId,
          keyboard.shift ? _dy : _dz,
          position,
          keyboard.shift ? 1 : -1
        );
      } else if (keyboard.s) {
        this.zoom(
          cameraId,
          keyboard.shift ? _dy : _dz,
          position,
          keyboard.shift ? -1 : 1
        );
      }

      if (keyboard.a) {
        this.zoom(cameraId, _dx, position, -1);
      } else if (keyboard.d) {
        this.zoom(cameraId, _dx, position);
      }

      mat3.set(_lookAtMatrix, ..._dx, ..._dy, ..._dz);

      quat.fromMat3(_quaternion, _lookAtMatrix);

      if (!quat.equals(quaternion, _quaternion)) {
        this.props.setQuaternion(cameraId, _quaternion);
      }
    }
  }

  zoom(cameraId, target, position, direction = 1) {
    const pos = vec3.create();
    vec3.scaleAndAdd(pos, position, target, .8 * direction);
    this.props.setPosition(cameraId, pos);
  }

}
