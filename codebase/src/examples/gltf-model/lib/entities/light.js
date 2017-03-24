import uuid from 'uuid';
import createCube from 'primitive-cube';

import createSimpleMaterial from 'materials/simple';
import { actions } from 'state/scene';
import { actions as transformActions } from 'state/transform';
import { actions as visualActions } from 'state/visual';
import { actions as lightActions } from 'state/light';

const { addTransform } = transformActions;
const { addVisual } = visualActions;
const { addLight } = lightActions;

export default function createLight(params) {
  const {
    entityId,
    position,
  } = params;
  const record = [];

  record.push(actions.createEntity(entityId));
  record.push(addTransform(entityId, {
    position: position,
  }));
  record.push(addVisual(entityId, {
    visualId: uuid.v1(),
    geometry: createCube(.2, .2, .2, 1, 1, 1),
    material: createSimpleMaterial({
      lightColor: [1.0, .0, .0],
    }),
  }));
  record.push(addLight(entityId));

  return record;
}
