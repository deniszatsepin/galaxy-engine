import createCube from 'primitive-cube';

import createLambertMaterial from 'materials/lambert';
import { actions } from 'state/scene';
import { actions as transformActions } from 'state/transform';
import { actions as visualActions } from 'state/visual';

const { addTransform } = transformActions;
const { addVisual } = visualActions;

export default function createBox(params) {
  const {
    entityId,
    size,
    position,
  } = params;
  const record = [];

  record.push(actions.createEntity(entityId));
  record.push(addTransform(entityId, {
    position: position,
  }));
  record.push(addVisual(entityId, {
    geometry: createCube(size[0], size[1], size[2], 1, 1, 1),
    material: createLambertMaterial(),
  }));

  return record;
}
