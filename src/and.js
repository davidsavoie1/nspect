import { AND } from "./constants";
import { flex, isFlex, unflex } from "./flex";
import { isOpt, opt } from "./opt";
import { failSafeCheck, getPred, setPred } from "./pred";
import { getSpread, setSpread } from "./spread";
import { entries, get, isColl, isFunc, set, typeOf } from "./util";

/* Combine multiple specs together, merging all the predicate functions
 * in a single one and reducing collections in a single one where each
 * key is also combined with `and`. */
export function and(...specs) {
  /* If any spec is a flex one, combine all specs as a single flex one. */
  const hasFlex = specs.find(isFlex);
  if (hasFlex) {
    return flex((...args) => {
      const definedSpecables = specs.map((spec) => unflex(spec, ...args));
      return and(...definedSpecables);
    });
  }

  const { collSpecs, predSpecs } = triageSpecs(specs);

  const pred = createAndPred(predSpecs);

  if (collSpecs.length < 1) return pred;

  /* No reduce seed so that first collection becomes the base spec. */
  const collSpec = collSpecs.reduce(combineCollSpecs);

  const collWithPred = setPred(pred, collSpec);

  /* If all collection specs are optional, flag the combined one as optional too. */
  const allOptional = collSpecs.every(isOpt);

  return allOptional ? opt(collWithPred) : collWithPred;
}

function triageSpecs(specs = []) {
  return specs.reduce(
    (acc, spec) => {
      if (isFunc(spec)) return { ...acc, predSpecs: [...acc.predSpecs, spec] };

      if (isColl(spec)) {
        const predSpec = getPred(spec);
        if (!predSpec) return { ...acc, collSpecs: [...acc.collSpecs, spec] };
        return {
          ...acc,
          predSpecs: [...acc.predSpecs, predSpec],
          collSpecs: [...acc.collSpecs, spec],
        };
      }

      if (spec === undefined || spec === true) return acc;

      return { ...acc, predSpecs: [...acc.predSpecs, () => spec] };
    },
    { collSpecs: [], predSpecs: [] }
  );
}

/* Reducer function that combines two same type collection specs.
 * Their pred specs are not considered here; they should be combined
 * with all pred specs in a single function. */
function combineCollSpecs(coll1, coll2) {
  if (typeOf(coll1) !== typeOf(coll2)) {
    throw new TypeError("Collection specs to combine must be of the same type");
  }

  const combinedSpread = and(getSpread(coll1), getSpread(coll2));

  const combinedCollSpec = entries(coll2).reduce((prev, [key, spec]) => {
    const prevSpec = get(key, coll1);
    if (!prevSpec) return set(key, spec, prev);

    /* If both collections have a spec for this key,
     * combine them with `and`. */
    return set(key, and(prevSpec, spec), prev);
  }, coll1);

  return setSpread(combinedSpread, combinedCollSpec);
}

function createAndPred(preds = []) {
  const fnPreds = preds.filter(isFunc);
  if (fnPreds.length < 1) return undefined;

  /* If only a single function pred, return it. */
  if (fnPreds.length === 1) return fnPreds[0];

  async function allPass(value, getFrom, options) {
    const results = await Promise.all(
      fnPreds.map((pred) => failSafeCheck(pred, value, getFrom, options))
    );

    const firstInvalidIndex = results.findIndex((res) => res !== true);
    return firstInvalidIndex < 0 ? true : results[firstInvalidIndex];
  }

  /* Attach predicates on the function itself, for reference. */
  allPass[AND] = fnPreds;
  return allPass;
}
