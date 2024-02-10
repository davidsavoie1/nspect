import { FLEX } from "./constants";
import { isFunc } from "./util";

/* A flex spec definition function is one that returns a normal one
 * based on the value to verify. */
export function flex(getSpec) {
  function flexSpec(value, getFrom) {
    return getSpec(value, getFrom);
  }

  flexSpec[FLEX] = true;
  return flexSpec;
}

export function isFlex(spec) {
  return isFunc(spec) && !!spec[FLEX];
}

export function unflex(spec, value, getFrom) {
  if (!isFlex(spec)) return spec;
  return unflex(spec(value, getFrom), value);
}
