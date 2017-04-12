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
        const parentInvert = mat4.invert(mat4.create(), parent.transform.localMatrix);
        const matrices = skin.jointNames.map((jointName, idx) => {
          const joint = getJointByName(state, jointName);
          const jointMatrix = mat4.create();
          const inverseBindMatrix = inverseBindMatrices.slice(idx * 16, (idx + 1) * 16);
          const bindShapeMatrix = skin.bindShapeMatrix;

          const tmp = mat4.mul(mat4.create(), inverseBindMatrix, bindShapeMatrix);
          const tmp2 = mat4.mul(mat4.create(), joint.transform.worldMatrix, tmp);

          const res = mat4.mul(mat4.create(), parentInvert, tmp2);
          return res;
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
        const matrices = calculateMatrices(child, parent);
        this.store.dispatch(actions.updateMatrices(child.entityId, matrices));
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

  if (child.jointName) {
    if (!parent.jointName) {
      mat4.multiply(worldMatrix, parent.transform.localMatrix, localMatrix);
    } else {
      mat4.multiply(worldMatrix, parent.transform.worldMatrix, localMatrix);
    }
  } else {
    if (!parent) {
      mat4.copy(worldMatrix, localMatrix);
    } else {
      mat4.multiply(worldMatrix, parent.transform.worldMatrix, localMatrix);
    }
  }

  mat4.invert(worldMatrixInvert, worldMatrix);

  return {
    localMatrix,
    worldMatrix,
    worldMatrixInvert,
  };
}

function getJointByName(scene, name) {
  const key = Object.keys(scene)
    .find(key => scene[key].name === name);
  return scene[key];
}
