import { ERRORS } from "./constants";
import { get, getOwn, isColl } from "./util";

/* Aggregate a list of errors saved on `ERRORS` key,
 * prepending the new key to the previous path. */
export function flatMapErrors(listOfEntries, ownResult, ownValue) {
  const updatedErrors = listOfEntries.flatMap(([key, res]) => {
    const prevErrors = ((res && res[ERRORS]) || []).map(({ path, ...rest }) =>
      enhanceError({
        path: [key, ...path],
        ...rest,
      })
    );

    /* Omit error if result is undefined */
    if (res === undefined) return prevErrors;

    const value = get(key, ownValue);

    /* If `res` is a collection, the error should have been caught in previous errors. */
    if (isColl(res)) return prevErrors;

    /* Prepend entry error to previous ones */
    return [
      enhanceError({
        path: [key],
        key,
        reason: res,
        value,
      }),
      ...prevErrors,
    ];
  });

  const ownError = isColl(ownResult) ? getOwn(ownResult) : ownResult;
  if (ownError === undefined) return updatedErrors;

  /* Prepend own error to updated entry ones. */
  return [
    enhanceError({
      path: [],
      key: undefined,
      reason: ownResult,
      value: ownValue,
    }),
    ...updatedErrors,
  ];
}

export function enhanceError(err) {
  const { path, reason = "" } = err;
  if (path === undefined || typeof reason !== "string") {
    return { ...err, message: reason, pathname: "" };
  }

  const pathname = path
    .map((k, index) =>
      typeof k === "number" ? `[${k}]` : index === 0 ? k : `.${k}`
    )
    .join("");

  return {
    ...err,
    message: [pathname, reason].filter((x) => x).join(" "),
    pathname,
  };
}

export function explain(inspectResult) {
  const errors = getErrors(inspectResult);
  const ownErrors = errors.filter(({ key }) => key === undefined);

  const invalid = errors.length > 0;
  const ownInvalid = ownErrors.length > 0;

  return {
    error: errors[0],
    errors,
    ownError: ownErrors[0],
    ownErrors,
    ownInvalid,
    ownValid: !ownInvalid,
    invalid,
    result: inspectResult,
    valid: !invalid,
  };
}

function getErrors(inspectResult) {
  if (!isColl(inspectResult))
    return inspectResult === undefined
      ? []
      : [enhanceError({ reason: inspectResult })];

  return inspectResult[ERRORS] || [];
}
