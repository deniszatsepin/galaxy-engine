import {
  ENTITY_ADD,
  ENTITY_REMOVE,
  ENTITY_CREATE,
  ENTITY_DELETE,
  ENTITY__SET_PARENT,
  ENTITY__UNSET_PARENT,
  ENTITY_SET_ROOT,
  SCENE__SET_CAMERA,
} from '../constants';

import light from './light.reducer';
import rotator from './rotator.reducer';
import createEntity from './entity';

function childIds(state, action) {
  switch (action.type) {
    case ENTITY_ADD: {
      return [ ...state, action.childId ]
    }
    case ENTITY_REMOVE: {
      return state.filter(id => id !== action.childId)
    }
    default: {
      return state;
    }
  }
}

function createNodeReducer(reducers) {
  const entity = createEntity(reducers);

  return function node(state = {}, action) {
    switch (action.type) {
      case ENTITY_CREATE: {
        return {
          entityId: action.entityId,
          parentId: null,
          childIds: [],
          ...Object.keys(action)
            .filter(key => ['type', 'entityId'].indexOf(key) === -1)
            .reduce((acc, key) => { acc[key] = action[key]; return acc; }, {}),
        };
      }
      case ENTITY_ADD:
      case ENTITY_REMOVE: {
        return {
          ...state,
          childIds: childIds(state.childIds, action),
        };
      }
      case ENTITY__SET_PARENT:
        return {
          ...state,
          parentId: action.parentId,
        };
      case ENTITY__UNSET_PARENT:
        return {
          ...state,
          parentId: null,
        };
      default: {
        return entity(state, action);
      }
    }
  };
}

function getAllDescendantIds(state, entityId) {
  return state[entityId].childIds.reduce((acc, childId) => (
    [...acc, childId, ...getAllDescendantIds(state, childId)]
  ), []);
}

function deleteMany(state, ids) {
  state = {...state};
  ids.forEach(id => delete state[id]);
  return state;
}

const mainReducers = [light, rotator];

export default function createSceneReducer(reducers) {
  const node = createNodeReducer([...reducers, ...mainReducers]);

  return function(state = {}, action) {
    const { entityId } = action;
    if (typeof entityId === 'undefined') {
      return state;
    }

    if (action.type === ENTITY_DELETE) {
      const descendantIds = getAllDescendantIds(state, entityId);
      return deleteMany(state, descendantIds);
    }

    if (action.type === ENTITY_SET_ROOT) {
      return {
        ...state,
        rootId: action.entityId,
      };
    }

    if (action.type === SCENE__SET_CAMERA) {
      return {
        ...state,
        cameraId: action.entityId,
      };
    }

    const nextEntityState = node(state[entityId], action);

    if (action.type === ENTITY_ADD || action.type === ENTITY_REMOVE) {
      const childId = action.childId;
      return {
        ...state,
        [entityId]: nextEntityState,
        [childId]: node(state[childId], {
          type: action.type === ENTITY_ADD ? ENTITY__SET_PARENT : ENTITY__UNSET_PARENT,
          entityId: childId,
          parentId: entityId,
        }),
      };
    }

    if (nextEntityState !== state[entityId]) {
      return {
        ...state,
        [entityId]: nextEntityState,
      };
    }

    return state;
  };
}
