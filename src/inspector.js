import { inspectionReducer } from "./inspectionReducer";

export function inspector({ ensure, required, selection, spec }) {
  let state = {};
  const baseArgs = {
    ensure,
    required,
    selection,
    spec,
  };

  async function inspect(prevValue, nextValue) {
    const nextState = await inspectionReducer(state, nextValue, {
      prevRootValue: prevValue,
      rootValue: nextValue,
      ...baseArgs,
    });

    state = nextState;

    return nextState.res;
  }

  return {
    async set(newValue) {
      return await inspect(state.value, newValue);
    },

    async check() {
      return await inspect(undefined, state.value);
    },
  };
}
