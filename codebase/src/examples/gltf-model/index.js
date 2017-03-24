import uuid from 'uuid';
import { quat } from 'gl-matrix';
import { createStore } from 'redux';
import {
  Scene,
  ServiceManager,
  SceneGraphService,
  ContainerService,
  RendererService,
  KeyboardService,
  MouseService,
  OrbitCameraService,
} from '../../';

import reducer from './lib/reducer';
import createRoot from './lib/entities/root';
import createBox from './lib/entities/box';
import createGround from './lib/entities/ground';
import createLight from './lib/entities/light';
import createCamera from './lib/entities/camera';

import { actions as playerActions } from 'state/player';
import { actions as keyboardActions } from 'state/keyboard';
import { actions as mouseActions } from 'state/mouse';
import { actions as transformActions } from 'state/transform';

//gltf
import { load } from 'loaders/gltf';
import {
  getScene,
  getSceneNodes,
  parseNode,
} from 'loaders/gltf/src/parse';

const { actions } = Scene;

const store = window.STORE = createStore(reducer);
const serviceManager = new ServiceManager(store);

serviceManager.addService(SceneGraphService);
serviceManager.addService(ContainerService);
serviceManager.addService(RendererService);
serviceManager.addService(KeyboardService, {
  connector: {
    mapStateToProps(state) {
      return {
        state: state.keyboard,
      };
    },
    mapDispatchToProps(dispatch) {
      return {
        startAction(action) {
          dispatch(keyboardActions.startAction(action));
        },
        stopAction(action) {
          dispatch(keyboardActions.stopAction(action));
        }
      };
    }
  },
});
serviceManager.addService(MouseService, {
  connector: {
    mapDispatchToProps(dispatch) {
      return {
        setPosition(position) {
          dispatch(mouseActions.setMousePosition(position));
        },
        setButtons(buttons) {
          dispatch(mouseActions.setMouseButtons(buttons));
        },
        setScroll(scroll) {
          dispatch(mouseActions.setMouseScroll(scroll));
        }
      };
    }
  }
});
serviceManager.addService(OrbitCameraService, {
  connector: {
    mapDispatchToProps(dispatch) {
      return {
        setQuaternion(entityId, quaternion) {
          dispatch(transformActions.setQuaternion(entityId, quaternion));
        },
        setPosition(entityId, position) {
          dispatch(transformActions.setPosition(entityId, position));
        }
      }
    }
  }
});

serviceManager.run();

const rootId = uuid.v1();
createRoot({
  entityId: rootId,
}).forEach(action => store.dispatch(action));

// const groundId = uuid.v1();
// createGround({
//   entityId: groundId,
//   position: [0, 0, 0],
//   size: [100, 100]
// }).forEach(action => store.dispatch(action));
// store.dispatch(actions.addEntityChild(rootId, groundId));

// const lightId = uuid.v1();
// createLight({
//   entityId: lightId,
//   position: [30, 60, 60],
// }).forEach(action => store.dispatch(action));
// store.dispatch(actions.addEntityChild(rootId, lightId));

// const boxId = uuid.v1();
// createBox({
//   entityId: boxId,
//   size: [10, 10, 10],
//   position: [30, 10, 30],
// }).forEach(action => store.dispatch(action));
// store.dispatch(actions.addEntityChild(rootId, boxId));

const playerId = uuid.v1();
store.dispatch(playerActions.createPlayer(playerId));

const cameraId = uuid.v1();
createCamera({
  entityId: cameraId,
  position: [30, 100, 100],
  target: [0, 0, 0],
}).forEach(action => store.dispatch(action));
store.dispatch(actions.addEntityChild(rootId, cameraId));
store.dispatch(actions.setCamera(cameraId));

load('/models/glTF/monster.gltf')
  .then((gltf) => {
    console.log(gltf);
    const scene = getScene(gltf);
    console.log(scene);
    const _actions = parseNode(gltf, scene.nodes[0]);
    const modelId = _actions[0].entityId;
    console.log(modelId);
    _actions.forEach(action => store.dispatch(action));
    store.dispatch(actions.addEntityChild(rootId, modelId));
    const state = store.getState();
    const model = state.scene[modelId];
    const rotation = model.transform.quaternion;
    const q = quat.create();
    quat.rotateX(q, rotation, -Math.PI / 2);
    store.dispatch(transformActions.setQuaternion(modelId, q));
  })
  .catch((e) => console.log(e));
