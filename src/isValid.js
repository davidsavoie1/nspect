import { inspect } from "./inspect";

/* Inspect value and return if valid.
 * Stop early, since only the first error is returned. */
export async function isValid({ ensure, required, selection, spec, value }) {
  const res = await inspect({
    ensure,
    required,
    selection,
    spec,
    stopEarly: true,
    value,
  });

  return res.valid;
}
