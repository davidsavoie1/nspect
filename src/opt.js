import { OPTIONAL } from "./constants.js";
import { flex } from "./flex";

/* Flag a selection as optional.
 * Selection appplies only if value is defined. */
export function opt(selection = {}) {
  selection[OPTIONAL] = true;
  return selection;
}

export function isOpt(selection) {
  return !selection || !!selection[OPTIONAL];
}

/* Enhance a spec to allow null or undefined value instead of being validated. */
export function nilable(spec) {
  return flex((x) => ([null, undefined].includes(x) ? () => true : spec));
}
