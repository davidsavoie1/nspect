import * as R from "ramda";
import * as s from "nspect";
import * as h from "./preds";

const typeEnum = {
  NUMBER: "NUMBER", // (ex: 2.5m, 4.56 kg, ...)
  INTEGER: "INTEGER", // (ex: 3 trous, 8 planches, ...)
  STRING: "STRING", // (ex: "rouge", description, commentaires, ...)
};

export function isValidSExp(str = "") {
  try {
    if (!(!!str && str.startsWith("(") && str.endsWith(")"))) return false;
    const openingCount = (str.match(/\(/g) || []).length;
    const closingCount = (str.match(/\)/g) || []).length;
    if (openingCount !== closingCount) return false;
    return !!str;
  } catch (err) {
    return false;
  }
}

const { NUMBER, INTEGER, STRING } = typeEnum;

export default function castValueByType(value, type) {
  if (R.isNil(value)) return value;

  if (type === STRING) return value.toString();

  if ([NUMBER, INTEGER].includes(type)) {
    if (value === "" || isNaN(+value)) return null;
    return +value;
  }

  return value;
}

export const abbr = s.and(
  h.nonEmptyString,
  (x) => /^[a-zA-Z0-9-_]+$/g.test(x) || "doit être alphanumérique seulement"
);
export const value = h.primitive;

export const choice = {
  _id: h.string,
  value,
  nomenclatureValue: h.string,
};

export const choices = s.spread(
  s.and(choice, {
    _id: function checkUniqueId(_id, getFrom) {
      const list = getFrom("../../");
      if (!list) return true;
      return (
        list.filter((ch) => ch._id === _id).length <= 1 || "doit être unique"
      );
    },
    value: (val, getFrom) => {
      const list = getFrom("../../");
      if (!list) return true;
      return (
        list.filter((ch) => ch.value === val).length <= 1 || "doit être unique"
      );
    },
  })
);

export const attributeValue = s.and(value, (val, getFrom) => {
  const attr = getFrom("../");

  const { allowInput, type, choices } = attr || {};
  if (!allowInput && choices) {
    return (
      choices.some((choice) => choice.value == val) ||
      "ne fait pas partie des choix"
    );
  }
  return validateByType(val, type);
});

export const attributeType = h.fromEnum(typeEnum);

const sortBys = Object.keys(choice);
const sExp = (x) => isValidSExp(x) || "ne respecte pas la syntaxe";
const nonEmptySExp = (x) =>
  x.length > 2 || "doit contenir au moins une opération";

export const formula = s.nilable(s.and(h.string, sExp, nonEmptySExp));

export const attribute = {
  _id: h.documentId,
  name: h.nonEmptyString,
  abbr,
  defaultValue: s.nilable(attributeValue),
  description: h.string,
  formula,
  type: attributeType,
  allowInput: s.and(h.boolean, (allow, getFrom) => {
    const choices = getFrom("../choices") || [];
    return (
      allow ||
      choices.length > 0 ||
      "doit être positif lorsqu'aucun choix n'est défini"
    );
  }),
  /* Display in nomenclatures */
  decimalsCount: s.nilable(s.and(h.number, h.gte(0))),
  fractions: s.nilable(s.spread(s.and(h.number, h.gt(0)))),
  useClosestFraction: h.boolean,

  choices: s.and(
    choices,
    s.spread({
      value: function validateType(val, getFrom) {
        const type = getFrom("../../../type");
        return validateByType(val, type);
      },
    })
  ),
  choicesSort: {
    by: (x) => sortBys.includes(x) || "n'est pas un champ triable",
    direction: h.number,
  },
};

export function validateByType(x, type) {
  if (type === typeEnum.NUMBER) return h.number(x);
  if (type === typeEnum.INTEGER) return h.integer(x);
  if (type === typeEnum.STRING) return h.string(x);
  return true;
}
