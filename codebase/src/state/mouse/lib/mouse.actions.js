import {
  MOUSE__SET_POSITION,
  MOUSE__SET_BUTTONS,
  MOUSE__SET_SCROLL,
} from './mouse.constants';

export function setMousePosition(position) {
  return {
    type: MOUSE__SET_POSITION,
    position,
  };
}

export function setMouseButtons(buttons) {
  return {
    type: MOUSE__SET_BUTTONS,
    buttons,
  };
}

export function setMouseScroll(scroll) {
  return {
    type: MOUSE__SET_SCROLL,
    scroll,
  };
}
