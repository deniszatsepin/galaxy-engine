import { quat } from 'gl-matrix';
import { actions } from 'state/scene';
import { actions as transformActions } from 'state/transform';
import { actions as targetActions } from 'state/target';

const { addTransform } = transformActions;
const { setTarget } = targetActions;

export default function createCamera(params) {
  const {
    entityId,
    position,
    target,
  } = params;
  const record = [];

  record.push(actions.createEntity(entityId, 'Camera'));
  record.push(addTransform(entityId, {
    position,
    quaternion: quat.create(),
  }));
  record.push(setTarget(entityId, target));

  return record;
}
