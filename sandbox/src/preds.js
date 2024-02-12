import * as s from "nspect";
import D from "dayjs";

export const boolean = (x = false) =>
  typeof x === "boolean" || "doit être vrai ou faux";

export const documentId = (x) =>
  /^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$/.test(x) ||
  "doit être un id de document valide";

export const jsDate = (x) => x instanceof Date || "doit être une date";

export const number = (x) => typeof x === "number" || "doit être un nombre";

export const string = (x) => typeof x === "string" || "doit être du texte";

export const validDate = (x) => D(x).isValid() || "doit être une date valide";

// DERIVED
export const dateStr = s.and(
  regExp(
    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
    "doit être une chaîne de date au format 'AAAA-MM-JJ'"
  ),
  validDate
);

export const documentIds = s.spread(documentId);

export const integer = s.and(
  number,
  (x) => Number.isInteger(x) || "doit être un nomber entier"
);

export const nonEmptyString = s.and(
  string,
  (x) => (x && x.length > 0) || "ne peut être vide"
);

export const nonNilValue = s.or(
  () => "doit être une valeur simple",
  string,
  number,
  boolean
);

export const stringOrNumber = s.or(
  () => "doit être numérique ou textuel",
  string,
  number
);

export const stringBetween = (minLength, maxLength) =>
  s.and(
    string,
    (x) =>
      !minLength ||
      x.length >= minLength ||
      `doit avoir au moins ${minLength} caractères`,
    (x) =>
      !maxLength ||
      x.length <= maxLength ||
      `doit avoir au plus ${maxLength} caractères`
  );

export const numberBetween = (min, max) =>
  s.and(
    number,
    (x) =>
      (min ?? null) === null ||
      x >= min ||
      `doit être plus grande ou égale à ${min}`,
    (x) =>
      (max ?? null) === null ||
      x <= max ||
      `doit être plus petite ou égale à ${max}`
  );

export const primitive = (x) =>
  x === null ||
  ["number", "boolean", "string", "undefined"].includes(typeof x) ||
  "doit être une valeur simple";

export const singleWord = regExp(
  /^\w*$/,
  "doit être un seul mot à caractères alphanumériques ou '_'"
);

// FACTORIES
export const fromEnum = (enumMap) => {
  const values = Object.values(enumMap);
  return (x) => values.includes(x) || "ne fait pas partie des choix";
};

export const gt =
  (min, { feminine } = {}) =>
  (x) =>
    x > min || `doit être plus grand${feminine ? "e" : ""} que ${min}`;

export const gte =
  (min, { feminine } = {}) =>
  (x) => {
    const feminize = feminine ? "e" : "";
    return (
      x >= min || `doit être plus grand${feminize} ou égal${feminize} à ${min}`
    );
  };

export const instanceOf = (cls) => (x) =>
  x instanceof cls || `doit être de la classe '${cls.name}'`;

export const nilable = (spec) =>
  s.or(spec, (x) => [null, undefined].includes(x));

export const oneOf =
  (choices = []) =>
  (x) =>
    choices.includes(x) || "ne fait pas partie des choix";

export function regExp(regex, msg = "ne respecte pas le format attendu") {
  return s.and(string, (x) => regex.test(x) || msg);
}

export const positiveNumber = s.and(number, gte(0));

export const variableName = regExp(
  /^[a-zA-Z_$][\w$]*$/,
  "doit contenir seulement des caractères alphanumériques, _ ou $ sans espace et ne peut commencer par un chiffre"
);
