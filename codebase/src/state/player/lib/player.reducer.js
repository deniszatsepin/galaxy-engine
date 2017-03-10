import { combineReducers } from 'redux';
import {
  PLAYER_CREATE,
  PLAYER_DELETE,
} from './player.constants';

function playerIdReducer(state = -1, action) {
  switch(action.type) {
  case PLAYER_CREATE:
    return action.playerId;
  default:
    return state;
  }
}

export default function createReducer(reducers = {}) {
  const player = combineReducers({
    playerId: playerIdReducer,
    ...reducers
  });

  return function(state = {}, action) {
    const { playerId } = action;
    
    if (typeof playerId === 'undefined') {
      return state;
    }

    if (action.type === PLAYER_DELETE) {
      state = {...state};
      delete state[playerId];
      return state;
    }

    const prev = state[playerId];

    if (action.type === PLAYER_CREATE) {
      return {
        ...state,
        [playerId]: player(prev, action),
      };
    }

    const next = player(prev, action);

    return prev !== next
      ? { ...state, [playerId]: next }
      : state;
  };
}
