
export default function createEntity(reducers) {
  const names = reducers.map(reducer => reducer.name);

  return function(state = {}, action) {
    const newStates = reducers.map((reducer, idx) => reducer(state[names[idx]], action));
    const changed = newStates.find((newState, idx) => newState !== state[names[idx]]);
    if (!changed) return state;

    return newStates.reduce((acc, newState, idx) => {
      acc[names[idx]] = newState;
      return acc;
    }, {
      ...state,
    });
  };
}
