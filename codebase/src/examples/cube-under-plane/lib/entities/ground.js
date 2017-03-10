import { quat } from 'gl-matrix';
import createPlane from 'primitive-plane';

import createLambertMaterial from 'materials/lambert';
import { actions } from 'state/scene';
import { actions as transformActions } from 'state/transform';
import { actions as visualActions } from 'state/visual';

const { addTransform } = transformActions;
const { addVisual } = visualActions;

export default function createGround(params) {
  const {
    entityId,
    position,
    size,
  } = params;
  const record = [];
  const quaternion = quat.create();

  // make it horizontal
  quat.rotateX(quaternion, quat.create(), -Math.PI / 2);

  record.push(actions.createEntity(entityId));
  record.push(addTransform(entityId, {
    position,
    quaternion,
  }));
  record.push(addVisual(entityId, {
    geometry: createPlane(size[0], size[1], size[0] * 2, size[1] * 2),
    material: createLambertMaterial(),
  }));

  return record;
}
