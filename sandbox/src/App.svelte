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

  // const isTHEAnswer = (x, getFrom) => {
  //   console.log("Check isTHEAnswer");
  //   const ansToTheUniverse = getFrom("../ansToTheUniverse");
  //   return x === ansToTheUniverse || "n'est pas la réponse à l'Univers";
  // };

  const sleep = (ms = 1000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const isTHEAnswer = async (x) => {
    console.log("Check isTHEAnswer");
    await sleep();
    const ansToTheUniverse = 42;
    return x === ansToTheUniverse || "n'est pas la réponse à l'Univers";
  };
</script>

<script>
  const spec = s.and(
    {
      ans: s.and(p.number, isTHEAnswer),
      // foo: s.and(
      //   () => {
      //     console.log("Check foo");
      //     return true;
      //   },
      //   p.string,
      //   p.stringBetween(3, 8)
      // ),
    }
    // (obj) => Object.keys(obj).includes("bar") || "doit contenir 'bar'"
  );

  let value = { ans: 41, ansToTheUniverse: 42, foo: "" };

  let validation = {};

  $: inspector = s.nspector({
    latent: true,
    ensure: { foo: 1 },
    spec,
    submit: (v) => console.log("Submitted", v),
    to: (res) => (validation = res),
  });

  $: inspector.inspect(value);

  $: ({ invalid } = s.explain(validation));
</script>

<form
  class="p-4 space-y-2"
  on:submit|preventDefault={() => inspector.submit(value)}
>
  <label class="block space-y-1">
    <span class={clsLabel}>Réponse</span>
    <input
      class={clsInputMaybeError(s.explain(validation.ans).invalid)}
      type="number"
      bind:value={value.ans}
      on:blur={() => inspector.activate("ans")}
    />
    <Nspector res={validation.ans} name="La réponse" />
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

  <label class="block space-y-1">
    <span class={clsLabel}>LA Réponse</span>
    <input
      class={clsInputMaybeError(s.explain(validation.ansToTheUniverse).invalid)}
      type="number"
      bind:value={value.ansToTheUniverse}
      on:blur={() => inspector.activate("ansToTheUniverse")}
    />
    <Nspector res={validation.ansToTheUniverse} name="LA Réponse" />
  </label>

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
