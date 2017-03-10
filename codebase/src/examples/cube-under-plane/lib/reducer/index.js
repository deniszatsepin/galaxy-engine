import { combineReducers } from 'redux';
import scene from './scene.reducer';
import players from './player.reducer';
import { reducer as keyboard } from 'state/keyboard';
import { reducer as mouse } from 'state/mouse';

export default combineReducers({
  scene,
  players,
  keyboard,
  mouse,
});
