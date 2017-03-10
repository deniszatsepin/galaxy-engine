import {
  PLAYER_CREATE,
  PLAYER_DELETE,
} from './player.constants';

export function createPlayer(playerId, data) {
  return {
    type: PLAYER_CREATE,
    playerId,
    ...data,
  };
}

export function deletePlayer(playerId) {
  return {
    type: PLAYER_DELETE,
    playerId,
  };
}
