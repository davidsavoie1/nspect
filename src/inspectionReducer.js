import equal from "fast-deep-equal/es6";
import {
  entries,
  fromEntries,
  get,
  getFromValue,
  getOwn,
  isColl,
  isFunc,
  keys,
  set,
  typeOf,
} from "./util";
import { DEPS, ERRORS, MISSING_VALUES, OWN } from "./constants";
import { unflex } from "./flex";
import { isOpt } from "./opt";
import { failSafeCheck, getPred } from "./pred";
import { getSpread } from "./spread";
import { flatMapErrors } from "./results";
import { getMessage } from "./messages";

const DEPS_SEPARATOR = "|";

export async function inspectionReducer(
  prevAcc = {},
  nextValue,
  {
    active,
    ensure,
    key,
    path = [],
    prevRootValue,
    required,
    rootValue,
    selection,
    spec,
  } = {}
) {
  /* PREPARATION */
  const _ensure = expandRequired(ensure, nextValue, getFrom);
  const _spec = unflex(spec, nextValue, getFrom);
  const _required = expandRequired(required, nextValue, getFrom);

  const {
    active: prevActive,
    deps: prevDeps,
    res: prevRes,
    value: prevValue,
  } = prevAcc;

  const prevIsActive = !!prevActive && !isColl(prevActive);
  const isActive = !!active && !isColl(active);
  const activated = !prevIsActive && isActive;

  const depChanged = anyDepChanged({
    deps: prevDeps,
    path,
    prevRootValue,
    rootValue,
  });

  const invalidated = activated || depChanged;

  const isRequired = _required && !isOpt(_required);
  const mustEnsure = _ensure && !isOpt(_ensure);

  const firstColl = [_spec, _required, _ensure, selection].find(isColl);
  const collType = firstColl && typeOf(firstColl);

  /* Create a predicate function that will check synchronously all "meta" data,
   * such as presence, requirement or collection type. */
  const checkMeta = combineSyncPreds(
    isRequired && hasValue,
    mustEnsure && isPresent,
    createCollTypePred(collType)
  );

  const ownPred = getPred(_spec);

  let ownDeps;

  /* Create `getFrom` pred validation second argument */
  function getFrom(relPathOrFn) {
    if (isFunc(relPathOrFn)) {
      /* If a dependency is a function, set ownDeps to true so that
       * result will always be invalidated, since we don't know
       * what potential side-effect the function might invoke. */
      ownDeps = true;
      return relPathOrFn();
    }

    /* Keep track of dependencies so that, on next inspection,
     * if any of those values changes, it will invalidate this result. */
    ownDeps = [ownDeps || "", relPathOrFn]
      .filter((x) => x)
      .join(DEPS_SEPARATOR);

    return getFromValue(relPathOrFn, path, rootValue);
  }

  /* Prepare a predicate function to validate own predicate. */
  const validateOwn = (x) =>
    validatePred(x, { getFrom, key, path, pred: ownPred });

  /* EXECUTION */

  /* If not a collection, replace value entirely */
  if (!isColl(nextValue)) {
    const hasChanged = !equal(prevValue, nextValue);
    const metaRes = checkMeta(nextValue);

    if (invalidated || hasChanged) {
      /* If value did change, return undefined when inactive,
       * invalid meta result if invalid
       * or validate next value. */
      const nextRes = !isActive
        ? undefined
        : metaRes !== true
        ? metaRes
        : await validateOwn(nextValue);

      /* Flag as changed */
      return {
        active,
        changed: hasChanged,
        deps: ownDeps,
        res: nextRes,
        value: nextValue,
      };
    } else {
      /* If inactive, return undefined result. */
      if (!isActive)
        return {
          changed: hasChanged,
          ...prevAcc,
          active,
          res: undefined,
        };

      /* If meta result is invalid, return as new result. */
      if (metaRes !== true)
        return {
          changed: hasChanged,
          ...prevAcc,
          active,
          res: metaRes,
        };

      /* Otherwise, reuse previous result and accumulator value. */
      return {
        changed: hasChanged,
        ...prevAcc,
        active,
      };
    }
  }

  /* If collection, reduce children in new reduced values */
  const nextType = typeOf(nextValue);

  const allKeys = [_spec, _required, _ensure, selection, nextValue]
    .filter(isColl)
    .flatMap(keys)
    .reduce((ks, k) => (ks.includes(k) || k === "..." ? ks : [...ks, k]), []);

  const { changed, deps, res, value } = await allKeys.reduce(
    async (accPromise, k) => {
      const acc = await accPromise;

      const subVal = get(k, nextValue);

      const subAcc =
        typeOf(prevValue) !== nextType
          ? {}
          : {
              active: isColl(prevActive) ? get(k, prevActive) : prevActive,
              deps: get(k, prevDeps),
              res: get(k, prevRes),
              value: get(k, prevValue),
            };

      const {
        changed: subChanged,
        deps: subDeps,
        res: subRes,
        value: subValue,
      } = await inspectionReducer(subAcc, subVal, {
        active: isColl(active) ? get(k, active) : active,
        ensure: get(k, _ensure) || getSpread(_ensure),
        key: k,
        path: [...path, k],
        prevRootValue,
        required: get(k, _required) || getSpread(_required),
        rootValue,
        selection:
          selection === Infinity
            ? selection
            : get(k, selection) || getSpread(selection) || false,
        spec: get(k, _spec) || getSpread(_spec),
      });

      return {
        ...acc,
        changed: acc.changed || subChanged,
        deps: set(k, subDeps, acc.deps),
        res: set(k, subRes, acc.res),
        value: set(k, subValue, acc.value),
      };
    },
    {
      deps: fromEntries([], nextType),
      res: fromEntries([], nextType),
      value: fromEntries([], nextType),
    }
  );

  const metaRes = checkMeta(value);
  const ownRes =
    metaRes !== true
      ? metaRes
      : invalidated || changed
      ? await validateOwn(value)
      : getOwn(prevRes);

  if (ownRes !== undefined) res[OWN] = ownRes;

  if (ownDeps) deps[DEPS] = ownDeps;

  const errors = flatMapErrors(entries(res), ownRes, value);
  if (errors.length > 0) res[ERRORS] = errors;

  return { active, changed, deps, res, value };
}

function anyDepChanged({ deps, path, prevRootValue, rootValue }) {
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

function combineSyncPreds(...preds) {
  const fnPreds = preds.filter(isFunc);
  if (fnPreds.length < 1) return () => true;
  if (fnPreds.length === 1) return fnPreds[0];
  return (...args) =>
    fnPreds.reduce(
      (res, fnPred) => (res !== true ? res : fnPred(...args)),
      true
    );
}

function createCollTypePred(collType) {
  if (!collType) return undefined;
  return function isCollType(x) {
    return typeOf(x) === collType || `must be of type ${collType}`;
  };
}

/* Validate a value against a predicate */
async function validatePred(value, { getFrom, pred, ...options }) {
  if (!pred) return undefined;
  const res = await failSafeCheck(pred, value, getFrom, options);

  return res === true ? undefined : res;
}

/* `requirable` can be a function that will return a `required` prop
 * when passed in the value and the `getFrom` function. */
function expandRequired(requirable, value, getFrom) {
  if (isFunc(requirable)) return expandRequired(requirable(value, getFrom));
  return requirable;
}

function hasValue(x) {
  return !MISSING_VALUES.includes(x) || getMessage("isRequired");
}

function isPresent(x) {
  return x !== undefined || getMessage("isMissing");
}
