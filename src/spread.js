import { and } from "./and.js";
import { SPREAD } from "./constants.js";
import { get, isColl, newColl } from "./util.js";

export function spread(spec, coll = []) {
  if (!isColl(coll))
    throw new TypeError(
      "Spread (...) can only be applied on a collection spec"
    );

  const currSpread = getSpread(coll);
  if (!currSpread) return setSpread(spec, coll);

  /* Since `coll` must be a collection, combine it with an empty collection
   * of the same type that used to carry the spread spec. */
  const enhancedSpread = and(coll, setSpread(spec, newColl(coll)));
  return setSpread(enhancedSpread, coll);
}

export function getSpread(coll) {
  return get(SPREAD, coll) || get("...", coll);
}

export function setSpread(spec, coll) {
  if (!spec) return coll;

  coll[SPREAD] = spec;
  return coll;
}
