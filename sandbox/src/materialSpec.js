import * as p from "./preds";

const referenceCode = p.regExp(/^[\w-]*$/);

export default {
  _id: p.string,
  abbr: p.stringBetween(0, 4),
  code: referenceCode,
  color: p.string,
  description: p.string,
  icon: p.string,
  name: p.string,

  removed: p.bool,
  removedAt: p.jsDate,

  inUse: p.bool,
};
