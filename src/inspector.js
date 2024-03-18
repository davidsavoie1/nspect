import { inspectionReducer } from "./inspectionReducer";
import { explain } from "./results";
import { collFromKey, isColl, normalizePath, setPath } from "./util";

export function inspector({
  latent = false, // Inactive at first, waiting for activation or first submit?
  ensure,
  required,
  selection,
  spec,
  submit, // (value) Function to call withh value after a successful inspection
  to, // (inpsectResult) Function to handle inspect result
}) {
  let active = !latent,
    state = {};

  const baseArgs = {
    ensure,
    required,
    selection,
    spec,
  };

  let promiseId;

  async function inspect(getPrevValue, getNextValue) {
    /* Ensure the last inspection promise has resolved before inspecting. */
    const prevValue = getPrevValue();
    const nextValue = getNextValue();

    const now = Date.now();
    promiseId = now;

    const reduced = await inspectionReducer(
      { ...state, value: prevValue },
      nextValue,
      {
        prevRootValue: prevValue,
        rootValue: nextValue,
        ...baseArgs,
        active,
      }
    );

    /* If the promiseId has changed, another validation
     * has been requested, so the current result should
     * be invalidated. */
    if (promiseId !== now) return;

    state = reduced;

    if (to) to(state.res);

    return state.res;
  }

  return {
    get result() {
      return state.res;
    },

    get state() {
      return state;
    },

    async activate(pathOrBool) {
      if (active !== true) {
        const path = normalizePath(pathOrBool);
        if (!path) active = !!pathOrBool;

        const activeColl = isColl(active) ? active : collFromKey(path[0]);
        active = setPath(path, true, activeColl);
      }

      const currValue = state.value;

      return await inspect(
        () => currValue,
        () => state.value
      );
    },

    async inspect(newValue) {
      return await inspect(
        () => state.value,
        () => newValue
      );
    },

    async reinspect() {
      return await inspect(
        () => undefined,
        () => state.value
      );
    },

    async reset() {
      const currValue = state.value;

      active = !latent;
      state = {};

      return await inspect(
        () => currValue,
        () => currValue
      );
    },

    async submit(newValue) {
      active = true;
      const res = await inspect(
        () => state.value,
        () => newValue
      );
      if (submit && !explain(res).invalid) submit(newValue);
    },
  };
}
