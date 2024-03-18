import { OR } from "./constants";
import { failSafeCheck } from "./pred";
import { isFunc } from "./util";

/* Combine multiple function predicate specs into a single predicate
 * that will return `true` as soon as one of the predicates is valid.
 * Otherwise, return the last invalid result. */
export function or(...specs) {
  if (!specs.every(isFunc)) {
    throw new TypeError(
      "'or' can only be used with function predicate specs. For more complex validation, use a 'flex' spec instead."
    );
  }

  return createOrPred(specs);
}

function createOrPred(preds = []) {
  const fnPreds = preds.filter(isFunc);
  if (fnPreds.length < 1) return undefined;

  async function anyPass(value, getFrom, options) {
    let firstInvalidRes;

    /* Execute preds one at a time in a short-circuit manner.
     * As soon as one is valid, stop execution. */
    for (const pred of fnPreds) {
      const res = await failSafeCheck(pred, value, getFrom, options);

      /* If result is valid, stop execution and return true. */
      if (res === true) return true;
      if (!firstInvalidRes) firstInvalidRes = res;
    }

    return firstInvalidRes;
  }

  /* Attach predicates on the function itself, for reference. */
  anyPass[OR] = fnPreds;
  return anyPass;
}
