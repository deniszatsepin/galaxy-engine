import { actions } from 'state/scene';
import { actions as transformActions } from 'state/transform';

const { addTransform } = transformActions;

export default function createBox(params) {
  const {
    entityId,
  } = params;
  const record = [];

  record.push(actions.createEntity(entityId));
  record.push(addTransform(entityId));
  record.push(actions.setRootEntity(entityId));

  return record;
}
