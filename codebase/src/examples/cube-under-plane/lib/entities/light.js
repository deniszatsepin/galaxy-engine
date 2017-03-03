import createCube from 'primitive-cube';

import createSimpleMaterial from 'materials/simple';
import { actions } from 'core/scene';
import { actions as transformActions } from 'components/transform';
import { actions as visualActions } from 'components/visual';
import { actions as lightActions } from 'components/light';

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
    geometry: createCube(.2, .2, .2, 1, 1, 1),
    material: createSimpleMaterial({
      lightColor: [1.0, .0, .0],
    }),
  }));
  record.push(addLight(entityId));

  return record;
}
