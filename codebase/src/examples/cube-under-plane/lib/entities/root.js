import { actions } from 'core/scene';
import { actions as transformActions } from 'components/transform';

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
