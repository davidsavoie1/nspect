import { inspect } from "./inspect";
import { getMessage } from "./messages";

/* Inspect value and return true if valid, first error if invalid.
 * Stop early, since only the first error is returned. */
export async function check({ ensure, required, selection, spec, value }) {
  const res = await inspect({
    ensure,
    required,
    selection,
    spec,
    stopEarly: true,
    value,
  });

  return res.valid ? true : res?.error?.message || getMessage("isInvalid");
}
