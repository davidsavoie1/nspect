import { validatePred } from "./inspectionHelpers";

/* Create a predicate that will check a value's key
 * instead of the value itself. */
export function key(keyPred) {
  return function checkKey(value, getFrom, options = {}) {
    return validatePred(options.key, {
      getFrom,
      pred: keyPred,
      ...options,
    });
  };
}
