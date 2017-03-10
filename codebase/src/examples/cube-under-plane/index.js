import uuid from 'uuid';
import { createStore } from 'redux';
import {
  Scene,
  ServiceManager,
  SceneGraphService,
  ContainerService,
  RendererService,
  KeyboardService,
  MouseService,
} from '../../';

import reducer from './lib/reducer';
import createRoot from './lib/entities/root';
import createBox from './lib/entities/box';
import createGround from './lib/entities/ground';
import createLight from './lib/entities/light';

import { actions as playerActions } from 'state/player';
import { actions as keyboardActions } from 'state/keyboard';
import { actions as mouseActions } from 'state/mouse';

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

const playerId = uuid.v1();
store.dispatch(playerActions.createPlayer(playerId));
