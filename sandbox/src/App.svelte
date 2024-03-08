<script context="module">
  import * as s from "nspect";
  import * as p from "./preds";

  import Nspector from "./Nspector.svelte";
  import {
    clsBtn,
    clsBtnError,
    clsBtnPrimary,
    clsInputMaybeError,
    clsLabel,
  } from "./classes";

  const isAnswer = (x, getFrom) => {
    const answer = getFrom("../answer");
    return x === answer || `n'est pas la réponse (${answer})`;
  };

  const sleep = (ms = 1000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const isTHEAnswer = async (x) => {
    // console.log("Check isTHEAnswer");
    await sleep(0);
    const ansToTheUniverse = 42;
    return x === ansToTheUniverse || "n'est pas LA réponse à l'Univers";
  };
</script>

<script>
  const spec = s.spread(p.string);

  let value = [1];
  // let value = [42];

  let validation = {};

  // $: inspector = s.nspector({
  //   // latent: true,
  //   // ensure: { foo: 1 },
  //   spec,
  //   submit: (v) => console.log("Submitted", v),
  //   to: (res) => (validation = res),
  // });

  $: s.inspect({
    // ensure: { foo: 1 },
    // required: { foo: 1 },
    // selection,
    spec,
    stopEarly: false,
    value,
  }).then(console.log);

  // $: inspector.inspect(value);

  $: ({ invalid } = s.explain(validation));
</script>

<form
  class="p-4 space-y-2"
  on:submit|preventDefault={() => inspector.submit(value)}
>
  <label class="block space-y-1">
    <span class={clsLabel}>Réponse</span>
    <input
      class={clsInputMaybeError(s.explain(validation.myAnswer).invalid)}
      type="number"
      bind:value={value.myAnswer}
      on:blur={() => inspector.activate("myAnswer")}
    />
    <Nspector res={validation.myAnswer} name="La réponse" />
  </label>

  <!-- <label class="block space-y-1">
    <span class={clsLabel}>Foo</span>
    <input
      class={clsInputMaybeError(s.explain(validation.foo).invalid)}
      type="text"
      bind:value={value.foo}
      on:blur={() => inspector.activate("foo")}
    />
    <Nspector res={validation.foo} name="Foo" />
  </label> -->

  <!-- <label class="block space-y-1">
    <span class={clsLabel}>LA Réponse</span>
    <input
      class={clsInputMaybeError(s.explain(validation.ansToTheUniverse).invalid)}
      type="number"
      bind:value={value.ansToTheUniverse}
      on:blur={() => inspector.activate("ansToTheUniverse")}
    />
    <Nspector res={validation.ansToTheUniverse} name="LA Réponse" />
  </label> -->

  <Nspector res={validation} name="La valeur" />

  <button
    class={invalid ? clsBtnError : clsBtnPrimary}
    disabled={invalid}
    type="submit"
  >
    Soumettre
  </button>

  <button class={clsBtn} type="button" on:click={() => inspector.reinspect()}>
    Réinspecter
  </button>

  <button class={clsBtn} type="button" on:click={() => inspector.reset()}>
    Reset
  </button>
</form>
