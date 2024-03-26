<script context="module">
  import { configure } from "svelte-specma";
  import * as specma from "nspect";
  import { specable } from "svelte-specma";

  import SpecableField from "./SpecableField.svelte";
  import { clsBtn, clsBtnError, clsBtnPrimary } from "./classes";
  import { twMerge } from "tailwind-merge";
  import materialSpec from "./materialSpec";

  configure(specma);

  const MATERIAL = {
    _id: "4jMTkscfKvXdiPuL2",
    abbr: "FC",
    code: "FC",
    name: "Fluocompacte",
    inUse: true,
  };
</script>

<script>
  export let material = {};
  export let required = undefined,
    resettable = false,
    spec = materialSpec;
  export let handlers = {};

  $: ({
    onCancel, // (form_)
    onSubmit = (vals) => console.log("SUBMIT!", vals), // (values, form_)
  } = handlers);

  $: readonly = !onSubmit ? true : null;

  $: material_ = specable(material, {
    fields: {
      abbr: 1,
      code: 1,
      description: 1,
      icon: 1,
      name: 1,
    },
    required,
    spec,
    onSubmit: (values) => {
      onSubmit(values, material_);
    },
  });

  $: ({ changed, error, valid } = $material_);

  // $: console.log($material_);

  function cancel() {
    if (onCancel) return onCancel(material_);
    if (resettable) material_.reset();
  }
</script>

<form
  class="flex flex-col gap-4 max-w-screen-lg pb-4 mx-auto"
  on:submit|preventDefault={material_.submit}
>
  <SpecableField specable={material_} caption="La matière" class="space-y-4">
    <div class="grid gap-4">
      <SpecableField
        specable={material_.stores.code}
        caption="Le code"
        disabled={!!(material?._id && material?.code)}
        inputClass="font-mono"
        label="Code de référence"
        {readonly}
      />

      <SpecableField
        specable={material_.stores.name}
        caption="Le nom"
        label="Nom"
        {readonly}
      />

      <SpecableField
        specable={material_.stores.abbr}
        caption="L'abbréviation"
        label="Abbréviation"
        {readonly}
        toValue={(str = "") => str.toUpperCase()}
      />

      <SpecableField
        specable={material_.stores.icon}
        caption="L'icône"
        label="Icône"
        {readonly}
      ></SpecableField>
    </div>

    <SpecableField
      specable={material_.stores.description}
      caption="La description"
      label="Description"
      {readonly}
      textarea
    />
  </SpecableField>

  <div>
    <button
      class={twMerge(clsBtnPrimary, error && clsBtnError)}
      disabled={!valid}
      type="submit"
    >
      Soumettre
    </button>

    {#if (resettable && changed) || onCancel}
      <button class={clsBtn} type="button" on:click={cancel}>Annuler</button>
    {/if}
  </div>
</form>

<style>
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  }
</style>
