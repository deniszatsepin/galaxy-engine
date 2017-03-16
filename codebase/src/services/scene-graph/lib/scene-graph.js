'use strict';

import { mat4 } from 'gl-matrix';
import Service from 'core/service';
import { actions } from 'state/transform';

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
  const rotationMatrix = mat4.create();
  const translationMatrix = mat4.create();
  const localMatrix = mat4.create();
  const worldMatrix = mat4.create();
  const worldMatrixInvert = mat4.create();
  const transform = child.transform;

  if (parent && !parent.transform.worldMatrix) return;

  mat4.fromRotationTranslation(
    localMatrix,
    transform.quaternion,
    transform.position
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
