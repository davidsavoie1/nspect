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
  a: p.number,
  foo: s.flex((x) =>
    typeof x === "number"
      ? isTHEAnswer
      : typeof x === "string"
        ? (str) => str.length === 42 || "n'est pas LA réponse textuelle"
        : () => "n'a même pas le bon type!"
  ),
  foo2: s.and(
    s.spread(p.string, [p.number, isTHEAnswer]),
    (obj) =>
      Object.entries(obj).length > 3 || "doit avoir plus de trois valeurs"
  ),
};

let value = {
  a: 2,
  foo: "Une réponse valide pour le moment, d'accord?",
  foo2: ["1", 42, 32],
};
// let value = [42];

// $: inspector = s.nspector({
//   // latent: true,
//   // ensure: { foo: 1 },
//   spec,
//   submit: (v) => console.log("Submitted", v),
//   to: (res) => (validation = res),
// });

// s.inspect({
//   // ensure: { foo: 1 },
//   // required: { foo: 1 },
//   selection: { foo: 1, foo2: false },
//   spec,
//   stopEarly: false,
//   value,
// }).then(({ errors }) => console.log(errors));

s.check({
  // ensure: { foo: 1 },
  // required: { foo: 1 },
  selection: { a: 1 },
  spec,
  stopEarly: false,
  value,
})
  .then(console.log)
  .catch((res) => console.warn("An error occurred:", res));
