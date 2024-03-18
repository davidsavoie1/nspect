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
import { DEPS, DEPS_SEPARATOR, ERRORS, OWN } from "./constants";
import { unflex } from "./flex";
import { isOpt } from "./opt";
import { getPred } from "./pred";
import { getSpread } from "./spreadHelpers";
import { flatMapErrors } from "./results";
import {
  anyDepChanged,
  combineSyncPreds,
  createCollTypePred,
  expandRequired,
  hasValue,
  isPresent,
  validatePred,
} from "./inspectionHelpers";

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
    selection = true,
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
  const shouldValidate =
    isRequired || mustEnsure || (!!selection && nextValue !== undefined);

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
      const nextRes =
        !isActive || !shouldValidate
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
      /* If inactive or not to be validated, return undefined result. */
      if (!isActive || !shouldValidate)
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

      const subSelection = isColl(selection)
        ? get(k, selection) ?? getSpread(selection) ?? false
        : selection;

      const subAcc =
        typeOf(prevValue) !== nextType
          ? {}
          : {
              active: isColl(prevActive) ? get(k, prevActive) : prevActive,
              deps: get(k, prevDeps),
              res: get(k, prevRes),
              value: get(k, prevValue),
            };

      const subReduced = await inspectionReducer(subAcc, subVal, {
        active: isColl(active) ? get(k, active) : active,
        ensure: get(k, _ensure) ?? getSpread(_ensure),
        key: k,
        path: [...path, k],
        prevRootValue,
        required: get(k, _required) ?? getSpread(_required),
        rootValue,
        selection: subSelection,
        spec: get(k, _spec) ?? getSpread(_spec),
      });

      const {
        changed: subChanged,
        deps: subDeps,
        res: subRes,
        value: subValue,
      } = subReduced;

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
  const ownRes = !shouldValidate
    ? undefined
    : metaRes !== true
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
