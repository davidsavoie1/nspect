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

  interpretConform(res);
}

function interpretConform(result) {
  if (result.valid === true) return result.value;
  const error = new Error(result.error.message);
  error.details = result.error;
  throw error;
}
