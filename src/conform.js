import { inspect } from "./inspect";

/* Inspect value and return value if valid, throw result if invalid. */
export async function conform({
  ensure,
  required,
  selection,
  spec,
  stopEarly = false,
  value,
}) {
  const res = await inspect({
    ensure,
    required,
    selection,
    spec,
    stopEarly,
    value,
  });

  if (res.valid) return value;

  throw res;
}
