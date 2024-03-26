import {
  entries,
  fromEntries,
  get,
  getFromValue,
  isColl,
  isFunc,
  keys,
  set,
  typeOf,
} from "./util";
import { ERRORS, OWN } from "./constants";
import { unflex } from "./flex";
import { isOpt } from "./opt";
import { getPred } from "./pred";
import { getSpread } from "./spreadHelpers";
import { explain, flatMapErrors } from "./results";
import {
  combineSyncPreds,
  createCollTypePred,
  expandRequired,
  hasValue,
  isPresent,
  validatePred,
} from "./inspectionHelpers";

export async function inspect({
  ensure,
  required,
  selection,
  spec,
  stopEarly = false, // Should validation stop as soon as an error is encountered,
  value,
}) {
  const inspection = await _inspect({
    ensure,
    required,
    rootValue: value,
    selection,
    spec,
    stopEarly,
    value,
  });

  return { ...explain(inspection), value };
}

async function _inspect({
  ensure,
  key,
  path = [],
  required,
  rootValue,
  selection = true,
  spec,
  stopEarly = false, // Should validation stop as soon as an error is encountered,
  value,
} = {}) {
  /* PREPARATION */
  const _ensure = expandRequired(ensure, value, getFrom);
  const _spec = unflex(spec, value, getFrom);
  const _required = expandRequired(required, value, getFrom);

  const isRequired = _required && !isOpt(_required);
  const mustEnsure = _ensure && !isOpt(_ensure);
  const shouldValidate =
    isRequired || mustEnsure || (!!selection && value !== undefined);

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

  /* Create `getFrom` pred validation second argument */
  function getFrom(relPathOrFn) {
    if (isFunc(relPathOrFn)) return relPathOrFn();

    return getFromValue(relPathOrFn, path, rootValue);
  }

  /* Prepare a predicate function to validate own predicate. */
  const validateOwn = (x) =>
    validatePred(x, { getFrom, key, path, pred: ownPred });

  /* EXECUTION */

  const metaRes = checkMeta(value);
  const ownRes = !shouldValidate
    ? undefined
    : metaRes !== true
    ? metaRes
    : await validateOwn(value);

  /* If not a collection, return own result only. */
  if (!isColl(value)) return ownRes;

  /* If collection, reduce children in new reduced result */
  const nextType = typeOf(value);

  const baseAcc = fromEntries([], nextType);

  /* If stopping early and base value is already invalid, do not validate children */
  if (stopEarly && ownRes !== undefined)
    return attachOwnRes({ ownRes, res: baseAcc, value });

  const allKeys = [_spec, _required, _ensure, selection, value]
    .filter(isColl)
    .flatMap(keys)
    .reduce((ks, k) => (ks.includes(k) || k === "..." ? ks : [...ks, k]), []);

  /* Execute all sub validations at once, in parallel */
  const resEntries = await Promise.all(
    allKeys.map(async (k) => {
      const subVal = get(k, value);

      const subSelection = isColl(selection)
        ? get(k, selection) ?? getSpread(selection) ?? false
        : selection;

      const subRes = await _inspect({
        ensure: get(k, _ensure) ?? getSpread(_ensure),
        key: k,
        path: [...path, k],
        required: get(k, _required) ?? getSpread(_required),
        rootValue,
        selection: subSelection,
        spec: get(k, _spec) ?? getSpread(_spec),
        stopEarly,
        value: subVal,
      });

      return [k, subRes];
    }, baseAcc)
  );

  const res = resEntries.reduce(
    (acc, [k, subRes]) => set(k, subRes, acc),
    baseAcc
  );

  return attachOwnRes({ ownRes, res, value });
}

function attachOwnRes({ ownRes, res, value }) {
  if (ownRes !== undefined) res[OWN] = ownRes;

  const errors = flatMapErrors(entries(res), ownRes, value);
  if (errors.length > 0) res[ERRORS] = errors;

  return res;
}
