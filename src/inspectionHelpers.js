import equal from "fast-deep-equal/es6";
import { getFromValue, isColl, isFunc, typeOf } from "./util";
import { DEPS, DEPS_SEPARATOR, MISSING_VALUES } from "./constants";
import { failSafeCheck } from "./pred";
import { getMessage } from "./messages";

export function anyDepChanged({ deps, path, prevRootValue, rootValue }) {
  const relPaths = depsToRelPaths(deps);
  if (!relPaths) return false;
  if (relPaths === true) return true;

  return relPaths.some((relPath) => {
    const prevVal = getFromValue(relPath, path, prevRootValue);
    const nextVal = getFromValue(relPath, path, rootValue);
    return !equal(prevVal, nextVal);
  });
}

function depsToRelPaths(deps) {
  if (!deps) return undefined;
  if (deps === true) return true;
  if (typeOf(deps) === "string") return deps.split(DEPS_SEPARATOR);
  if (isColl(deps)) return depsToRelPaths(deps[DEPS]);
  return undefined;
}

export function combineSyncPreds(...preds) {
  const fnPreds = preds.filter(isFunc);
  if (fnPreds.length < 1) return () => true;
  if (fnPreds.length === 1) return fnPreds[0];
  return (...args) =>
    fnPreds.reduce(
      (res, fnPred) => (res !== true ? res : fnPred(...args)),
      true
    );
}

export function createCollTypePred(collType) {
  if (!collType) return undefined;
  return function isCollType(x) {
    return typeOf(x) === collType || `must be of type ${collType}`;
  };
}

/* Validate a value against a predicate */
export async function validatePred(value, { getFrom, pred, ...options }) {
  if (!pred) return undefined;
  const res = await failSafeCheck(pred, value, getFrom, options);

  return res === true ? undefined : res;
}

/* `requirable` can be a function that will return a `required` prop
 * when passed in the value and the `getFrom` function. */
export function expandRequired(requirable, value, getFrom) {
  if (isFunc(requirable)) return expandRequired(requirable(value, getFrom));
  return requirable;
}

export function hasValue(x) {
  return !MISSING_VALUES.includes(x) || getMessage("isRequired");
}

export function isPresent(x) {
  return x !== undefined || getMessage("isMissing");
}
