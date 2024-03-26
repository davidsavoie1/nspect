import { validatePredSpecma } from "./inspectionHelpers";

export { and } from "./and";
export { check } from "./check";
export { conform } from "./conform";
export { flex, isFlex, unflex } from "./flex";
export { inspect } from "./inspect";
export { inspector as nspector } from "./inspector";
export { isValid } from "./isValid";
export { key } from "./key";
export { getMessage, getMessages, setMessages } from "./messages";
export { isOpt, nilable, opt } from "./opt";
export { or } from "./or";
export { getPred } from "./pred";
export { explain } from "./results";
export { select } from "./select";
export { spread } from "./spread";
export { getSpread } from "./spreadHelpers";

/* For retrocompatibility with Svelte-Specma `configure(specmaFns)`.
 * Particularly useful for progressive migration to Nspect. */
export { validatePredSpecma as validatePred };
