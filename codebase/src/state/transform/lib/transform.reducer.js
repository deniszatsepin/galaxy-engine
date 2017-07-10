import {
  vec3,
  quat,
} from 'gl-matrix';

import {
	ADD_COMPONENT_TRANSFORM,
  REMOVE_COMPONENT_TRANSFORM,
	TRANSFORM__SET_POSITION,
	TRANSFORM__TRANSLATE_X,
	TRANSFORM__TRANSLATE_Y,
	TRANSFORM__TRANSLATE_Z,
	TRANSFORM__SET_QUATERNION,
	TRANSFORM__ROTATE_X,
	TRANSFORM__ROTATE_Y,
	TRANSFORM__ROTATE_Z,
  TRANSFORM__SET_SCALE,
  TRANSFORM__UPDATE_MATRICES,
} from './transform.constants';

export default function transform(state = {}, action) {
  switch(action.type) {
    case ADD_COMPONENT_TRANSFORM: {
      return {
        position: action.position || vec3.create(),
        quaternion: action.quaternion || quat.create(),
        scale: action.scale || vec3.fromValues(1, 1, 1),
      };
    }
    case REMOVE_COMPONENT_TRANSFORM: {
      return {};
    }
    case TRANSFORM__SET_POSITION: {
      return {
        ...state,
        position: vec3.clone(action.position),
      };
    }
    case TRANSFORM__TRANSLATE_X: {
      return {
        ...state,
        position: vec3.add(
          vec3.create(),
          state.position,
          vec3.fromValues(action.distance, 0, 0)
        ),
      };
    }
    case TRANSFORM__TRANSLATE_Y: {
      return {
        ...state,
        position: vec3.add(
          vec3.create(),
          state.position,
          vec3.fromValues(0, action.distance, 0)
        ),
      };
    }
    case TRANSFORM__TRANSLATE_Z: {
      return {
        ...state,
        position: vec3.add(
          vec3.create(),
          state.position,
          vec3.fromValues(0, 0, action.distance)
        ),
      };
    }
    case TRANSFORM__SET_QUATERNION: {
      return {
        ...state,
        quaternion: quat.clone(action.quaternion),
      };
    }
    case TRANSFORM__ROTATE_X: {
      return {
        ...state,
        quaternion: quat.rotateX(quat.create(), state.quaternion, action.rad),
      };
    }
    case TRANSFORM__ROTATE_Y: {
      return {
        ...state,
        quaternion: quat.rotateY(quat.create(), state.quaternion, action.rad),
      };
    }
    case TRANSFORM__ROTATE_Z: {
      return {
        ...state,
        quaternion: quat.rotateZ(quat.create(), state.quaternion, action.rad),
      };
    }
    case TRANSFORM__SET_SCALE: {
      return {
        ...state,
        scale: vec3.clone(action.scale),
      };
    }
    case TRANSFORM__UPDATE_MATRICES: {
      return {
        ...state,
        ...Object.keys(action)
          .filter(key => ['type', 'entityId'].indexOf(key) === -1)
          .reduce((acc, key) => { acc[key] = action[key]; return acc;}, {}),
      }
    }
    default: {
      return state;
    }
  }
}
