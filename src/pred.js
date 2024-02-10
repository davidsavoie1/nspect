import { PRED } from "./constants.js";
import { getMessage } from "./messages.js";
import { isColl, isFunc } from "./util.js";

export function getPred(spec) {
  if (isFunc(spec)) return spec;
  return spec && spec[PRED];
}

export function setPred(pred, coll) {
  if (!isColl(coll)) {
    throw new TypeError("A pred can only be attached to a collection");
  }

  if (isFunc(pred)) {
    coll[PRED] = pred;
  }

  return coll;
}

/* Check a value against a predicate.
 * If an error occurs during validation, returns false without throwing. */
export function failSafeCheck(pred, ...args) {
  const defaultReason = pred.name
    ? `failed '${pred.name}'`
    : getMessage("isInvalid");
  try {
    return pred(...args) || defaultReason;
  } catch (err) {
    /* eslint-disable no-console */
    if (console && console.error) {
      console.error(
        `Nspect: Failed '${pred.name}' pred because of runtime error:`,
        err.message
      );
    }
    /* eslint-enable no-console */
    return defaultReason;
  }
}
