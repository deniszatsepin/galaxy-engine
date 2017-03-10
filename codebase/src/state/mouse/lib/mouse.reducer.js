import {
  MOUSE__SET_POSITION,
  MOUSE__SET_BUTTONS,
  MOUSE__SET_SCROLL,
} from './mouse.constants';

function position(state = {
  x: Number.MIN_VALUE,
  y: Number.MIN_VALUE,
}, action) {
  if (action.type === MOUSE__SET_POSITION) {
    return action.position;
  }

  return state;
}

function buttons(state = {
  left: false,
  middle: false,
  right: false
}, action) {
  if (action.type === MOUSE__SET_BUTTONS) {
    return {
      ...state,
      ...action.buttons,
    };
  }

  return state;
}

function scroll(state = {
  x: 0,
  y: 0,
  z: 0
}, action) {
  if (action.type === MOUSE__SET_SCROLL) {
    return action.scroll;
  }

  return state;
}

export default function reducer(state = {}, action) {
  return {
    position: position(state.position, action),
    buttons: buttons(state.buttons, action),
    scroll: scroll(state.scroll, action),
  };
}
