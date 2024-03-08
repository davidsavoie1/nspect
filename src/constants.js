export const AND = Symbol("AND");
export const DEPS = Symbol("DEPS");
export const ERRORS = Symbol("ERRORS");
export const FLEX = Symbol("FLEX");
export const OWN = Symbol("OWN");
export const OPTIONAL = Symbol("OPTIONAL");
export const OR = Symbol("OR");
export const PRED = Symbol("PRED");
export const RESULT = Symbol("RESULT");
export const SPREAD = Symbol("SPREAD");

export const VALID = { valid: true, promise: Promise.resolve({ valid: true }) };

export const MISSING_VALUES = [undefined, null, ""];
export const DEPS_SEPARATOR = "|";
