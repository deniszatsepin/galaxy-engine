import { combineReducers } from 'redux';
import scene from './scene.reducer';
import players from './player.reducer';
import { reducer as keyboard } from 'state/keyboard';
import { reducer as mouse } from 'state/mouse';
import { reducer as animations } from 'state/animation-info';
import { reducer as samples } from 'state/sampler';

export default combineReducers({
  scene,
  players,
  keyboard,
  mouse,
  animations,
  samples,
});
