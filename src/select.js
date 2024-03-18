import { getSpread } from "./spreadHelpers";
import { entries, fromEntries, isColl } from "./util";

/* Deep select value from selection. Collection spec can be used as selection.
 * A branch will be selected if its selection value is thruthy. */
export function select(selection, value) {
  if (!(isColl(selection) && isColl(value))) return value;

  const explicitSelectionMap = new Map(
    entries(selection).filter(([k]) => k !== "...")
  );
  const spreadSelection = getSpread(selection);

  if (!spreadSelection && explicitSelectionMap.size <= 0) return value;

  return fromEntries(
    entries(value)
      .filter(([key]) =>
        explicitSelectionMap.has(key)
          ? explicitSelectionMap.get(key)
          : !!spreadSelection
      )
      .map(([key, val]) => [
        key,
        select(explicitSelectionMap.get(key) || spreadSelection, val),
      ])
      .filter(([, val]) => val !== undefined),
    value
  );
}
