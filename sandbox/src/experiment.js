import * as s from "nspect";
import * as p from "./preds";

const isAnswer = (x, getFrom) => {
  const answer = getFrom("../answer");
  return x === answer || `n'est pas la réponse (${answer})`;
};

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const isTHEAnswer = async (x) => {
  // console.log("Check isTHEAnswer");
  await sleep(0);
  const ansToTheUniverse = 42;
  return x === ansToTheUniverse || "n'est pas LA réponse à l'Univers";
};

const spec = {
  foo: isTHEAnswer,
  foo2: s.and(
    s.spread(p.string, [p.number, isTHEAnswer]),
    (obj) =>
      Object.entries(obj).length > 3 || "doit avoir plus de trois valeurs"
  ),
};

let value = { foo: null, foo2: ["1", 42, 32] };
// let value = [42];

// $: inspector = s.nspector({
//   // latent: true,
//   // ensure: { foo: 1 },
//   spec,
//   submit: (v) => console.log("Submitted", v),
//   to: (res) => (validation = res),
// });

s.inspect({
  // ensure: { foo: 1 },
  // required: { foo: 1 },
  selection: { foo: 1, foo2: s.spread(true) },
  spec,
  stopEarly: false,
  value,
}).then(({ errors }) => console.log(errors));
