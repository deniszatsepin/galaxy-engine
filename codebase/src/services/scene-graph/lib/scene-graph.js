'use strict';

import { mat4 } from 'gl-matrix';
import Service from 'core/service';
import { actions } from 'state/transform';
import { actions as visualActions }  from 'state/visual';

const {
  updateVisual,
} = visualActions;

export default class SceneGraphService extends Service {

  constructor(params = {}) {
    params.name = 'scenegraph';
    params.priority = 90;
    super(params);
  }

  initialize(store) {
    super.initialize(store);
    this._prevState = {};
  }

  update() {
    this.traverse();
    this._prevState = this.store.getState().scene;
  }

  //TODO: check dirty values before update them
  traverse(parent) {
    let state = this.store.getState().scene;
    const prevState = this._prevState;

    if (!parent) {
      parent = state[state.rootId];
      if (!parent) return;

      if (parent !== prevState[state.rootId]) {
        const matrices = calculateMatrices(parent);
        this.store.dispatch(actions.updateMatrices(parent.entityId, matrices));
      }

      state = this.store.getState().scene;
      parent = state[state.rootId];
    } else {
      parent = state[parent.entityId];
    }

    if (parent.visual && parent.visual.length) {
      const skin = parent.visual[0].skin;
      if (skin) {
        const inverseBindMatrices = skin.inverseBindMatrices;
        const matrices = skin.jointNames.map((jointName, idx) => {
          const joint = getJointByName(state, jointName);
          const jointMatrix = mat4.create();
          const inverseBindMatrix = inverseBindMatrices.slice(idx * 16, (idx + 1) * 16);

          const tmp = mat4.mul(mat4.create(), inverseBindMatrix, skin.bindShapeMatrix);
          mat4.mul(jointMatrix, joint.transform.jointWorldMatrix, tmp);
          return mat4.mul(mat4.create(), joint.transform.worldMatrixInvert, jointMatrix);

          // const tmp = mat4.mul(mat4.create(), joint.transform.jointWorldMatrix, inverseBindMatrix);
          // mat4.mul(jointMatrix, tmp, skin.bindShapeMatrix);
          // return mat4.mul(mat4.create(), joint.transform.worldMatrixInvert, jointMatrix);
        });
        this.store.dispatch(updateVisual(parent.entityId, {
          ...parent.visual[0],
          skin: {
            ...skin,
            matrices,
          },
        }))
      }
    }

    const children = parent.childIds.map(id => state[id]);
    children.forEach(child => {
      if (child !== prevState[child.entityId] || parent !== prevState[parent.entityId]) {
        if (!child.jointName) {
          const matrices = calculateMatrices(child, parent);
          this.store.dispatch(actions.updateMatrices(child.entityId, matrices));
        } else {
          const jointMatrices = calculateJointMatrices(child, parent);
          this.store.dispatch(actions.updateMatrices(child.entityId, jointMatrices));
        }
      }
      this.traverse(child);
    });
  }
}

function calculateMatrices(child, parent) {
  const localMatrix = mat4.create();
  const worldMatrix = mat4.create();
  const worldMatrixInvert = mat4.create();
  const transform = child.transform;

  if (parent && !parent.transform.worldMatrix) return;

  mat4.fromRotationTranslationScale(
    localMatrix,
    transform.quaternion,
    transform.position,
    transform.scale,
  );

  if (!parent) {
    mat4.copy(worldMatrix, localMatrix);
  } else {
    mat4.multiply(worldMatrix, localMatrix, parent.transform.worldMatrix);
  }

  mat4.invert(worldMatrixInvert, worldMatrix);

  return {
    localMatrix,
    worldMatrix,
    worldMatrixInvert,
  };
}

function calculateJointMatrices(child, parent) {
  const jointMatrix = mat4.create();
  const jointWorldMatrix = mat4.create();
  const jointWorldMatrixInvert = mat4.create();
  const transform = child.transform;

  // if (parent && !parent.transform.jointWorldMatrix) return;

  mat4.fromRotationTranslationScale(
    jointMatrix,
    transform.quaternion,
    transform.position,
    transform.scale,
  );

  if (!parent.transform.jointWorldMatrix) {
    // mat4.copy(jointWorldMatrix, jointMatrix);
    mat4.multiply(jointWorldMatrix, jointMatrix, parent.transform.localMatrix);
  } else {
    mat4.multiply(jointWorldMatrix, jointMatrix, parent.transform.jointWorldMatrix);
  }

  mat4.invert(jointWorldMatrixInvert, jointWorldMatrix);

  return {
    worldMatrixInvert: parent.transform.worldMatrixInvert,
    jointMatrix,
    jointWorldMatrix,
    jointWorldMatrixInvert,
  };
}

function getJointByName(scene, name) {
  const key = Object.keys(scene)
    .find(key => scene[key].name === name);
  return scene[key];
}
