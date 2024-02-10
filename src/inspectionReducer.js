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

const DEPS_SEPARATOR = "|";

export async function inspectionReducer(
  prevAcc = {},
  nextValue,
  {
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

  const { deps: prevDeps, res: prevRes, value: prevValue } = prevAcc;

  const invalidated = anyDepChanged({
    deps: prevDeps,
    path,
    prevRootValue,
    rootValue,
  });

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
    const metaRes = checkMeta(nextValue);

    /* If value did not change and has not been invalidated,
     * indicate that no change has occurred.
     * If meta result is invalid, return as new result.
     * Otherwise, reuse previous result and accumulator value. */
    if (!invalidated && equal(prevValue, nextValue)) {
      if (metaRes !== true) return { changed: false, ...prevAcc, res: metaRes };
      return { changed: false, ...prevAcc };
    }

    /* If value did change, return invalid meta result or validate next value. */
    const nextRes = metaRes !== true ? metaRes : await validateOwn(nextValue);
    return { changed: true, deps: ownDeps, res: nextRes, value: nextValue };
  }

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
  res[ERRORS] = errors;

  return { changed, deps, res, value };
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

/* Aggregate a list of errors saved on `ERRORS` key,
 * prepending the new key to the previous path. */
function flatMapErrors(listOfEntries, ownResult, ownValue) {
  const updatedErrors = listOfEntries.flatMap(([key, res]) => {
    const prevErrors = ((res && res[ERRORS]) || []).map(({ path, ...rest }) =>
      enhanceError({
        path: [key, ...path],
        ...rest,
      })
    );

    /* Omit error if result is undefined */
    if (res === undefined) return prevErrors;

    const value = get(key, ownValue);

    /* If `res` is a collection, the error should have been caught in previous errors. */
    if (isColl(res)) return prevErrors;

    /* Prepend entry error to previous ones */
    return [
      enhanceError({
        path: [key],
        key,
        reason: res,
        value,
      }),
      ...prevErrors,
    ];
  });

  const ownError = isColl(ownResult) ? getOwn(ownResult) : ownResult;
  if (ownError === undefined) return updatedErrors;

  /* Prepend own error to updated entry ones. */
  return [
    enhanceError({
      path: [],
      key: undefined,
      reason: ownResult,
      value: ownValue,
    }),
    ...updatedErrors,
  ];
}

function enhanceError(err) {
  const { path, reason = "" } = err;
  if (path === undefined || typeof reason !== "string") {
    return { ...err, message: reason, pathname: "" };
  }

  const pathname = path
    .map((k, index) =>
      typeof k === "number" ? `[${k}]` : index === 0 ? k : `.${k}`
    )
    .join("");

  return {
    ...err,
    message: [pathname, reason].filter((x) => x).join(" "),
    pathname,
  };
}

/* `requirable` can be a function that will return a `required` prop
 * when passed in the value and the `getFrom` function. */
function expandRequired(requirable, value, getFrom) {
  if (isFunc(requirable)) return expandRequired(requirable(value, getFrom));
  return requirable;
}

function hasValue(x) {
  return !MISSING_VALUES.includes(x) || "is required";
}

function isPresent(x) {
  return x !== undefined || "is missing";
}
