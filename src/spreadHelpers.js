import { SPREAD } from "./constants.js";
import { get } from "./util.js";

export function getSpread(coll) {
  return get(SPREAD, coll) || get("...", coll);
}

export function setSpread(spec, coll) {
  if (!spec) return coll;

  coll[SPREAD] = spec;
  return coll;
}
