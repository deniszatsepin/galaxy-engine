import uuid from 'uuid';
import { createStore } from 'redux';
import {
  Scene,
  ServiceManager,
  SceneGraphService,
  ContainerService,
  RendererService
} from '../../';

import reducer from './lib/reducer';
import createRoot from './lib/entities/root';
import createBox from './lib/entities/box';
import createGround from './lib/entities/ground';
import createLight from './lib/entities/light';

const { actions } = Scene;

const sceneGraphService = new SceneGraphService();
const containerService = new ContainerService();
const rendererService = new RendererService();

const store = window.STORE = createStore(reducer);
const serviceManager = new ServiceManager(store);

serviceManager.addService(sceneGraphService);
serviceManager.addService(containerService);
serviceManager.addService(rendererService);

serviceManager.run();

const rootId = uuid.v1();
createRoot({
  entityId: rootId,
}).forEach(action => store.dispatch(action));

const groundId = uuid.v1();
createGround({
  entityId: groundId,
  position: [0, 0, 0],
  size: [60, 60]
}).forEach(action => store.dispatch(action));
store.dispatch(actions.addEntityChild(rootId, groundId));

const lightId = uuid.v1();
createLight({
  entityId: lightId,
  position: [30, 60, 60],
}).forEach(action => store.dispatch(action));
store.dispatch(actions.addEntityChild(rootId, lightId));

const boxId = uuid.v1();
createBox({
  entityId: boxId,
  size: [10, 10, 10],
  position: [0, 10, 0],
}).forEach(action => store.dispatch(action));
store.dispatch(actions.addEntityChild(rootId, boxId));
