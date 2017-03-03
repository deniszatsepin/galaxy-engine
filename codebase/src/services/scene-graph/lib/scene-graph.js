'use strict';

import { mat4 } from 'gl-matrix';
import Service from 'core/service';
import { actions } from 'components/transform';

export default class SceneGraphService extends Service {

  constructor(params = {}) {
    params.name = 'scenegraph';
    params.priority = 90;
    super(params);
  }

  initialize(store) {
    super.initialize(store);
    this._prevState = store.getState().scene;
  }

  update() {
    this.traverse();
  }

  //TODO: check dirty values before update them
  traverse(parent) {
    let state = this.store.getState().scene;

    if (!parent) {
      parent = state[state.rootId];
      if (!parent) return;
      const matrices = calculateMatrices(parent);
      this.store.dispatch(actions.updateMatrices(parent.entityId, matrices));
      state = this.store.getState().scene;
      parent = state[state.rootId];
    }

    const children = parent.childIds.map(id => state[id]);
    children.forEach(child => {
      const matrices = calculateMatrices(child, parent);
      this.store.dispatch(actions.updateMatrices(child.entityId, matrices));
      this.traverse(child);
    });
  }
}

function calculateMatrices(child, parent) {
  const localMatrix = mat4.create();
  const worldMatrix = mat4.create();
  const worldMatrixInvert = mat4.create();
  const transform = child.transform;

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
