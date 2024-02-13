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

  const not42 = (x, getFrom) => {
    console.log("Check not42");
    getFrom("../foo2");
    return x !== 42 || "ne peut être la réponse de l'univers";
  };
</script>

<script>
  const spec = s.and(
    {
      ans: s.and(p.number, not42),
      foo: s.and(
        () => {
          console.log("Check foo");
          return true;
        },
        p.string,
        p.stringBetween(3, 8)
      ),
    }
    // (obj) => Object.keys(obj).includes("bar") || "doit contenir 'bar'"
  );

  let value = { ans: 42, foo: "" };

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

  <label class="block space-y-1">
    <span class={clsLabel}>Foo</span>
    <input
      class={clsInputMaybeError(s.explain(validation.foo).invalid)}
      type="text"
      bind:value={value.foo}
      on:blur={() => inspector.activate("foo")}
    />
    <Nspector res={validation.foo} name="Foo" />
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
