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

  let inspectionPromise;

  async function inspectSerialized(...args) {
    await inspectionPromise;
    inspectionPromise = inspect(...args);
    return inspectionPromise;
  }

  async function inspect(getPrevValue, getNextValue) {
    /* Ensure the last inspection promise has resolved before inspecting. */
    const prevValue = getPrevValue();
    const nextValue = getNextValue();

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

      await inspectionPromise;
      const currValue = state.value;

      return await inspectSerialized(
        () => currValue,
        () => state.value
      );
    },

    async inspect(newValue) {
      return await inspectSerialized(
        () => state.value,
        () => newValue
      );
    },

    async reinspect() {
      return await inspectSerialized(
        () => undefined,
        () => state.value
      );
    },

    async reset() {
      await inspectionPromise;
      const currValue = state.value;

      active = !latent;
      state = {};

      return await inspectSerialized(
        () => currValue,
        () => currValue
      );
    },

    async submit(newValue) {
      active = true;
      const res = await inspectSerialized(
        () => state.value,
        () => newValue
      );
      if (submit && !explain(res).invalid) submit(newValue);
    },
  };
}
