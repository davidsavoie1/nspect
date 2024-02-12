<script context="module">
  import { explain } from "nspect";
</script>

<script>
  export let res = undefined;
  export let name = "",
    own = true,
    single = true;

  $: ({ errors, ownErrors } = explain(res));

  $: errorsToDisplay = ((own ? ownErrors : errors) || []).map((err) => ({
    ...err,
    caption: own ? err.reason : err.message,
  }));

  $: error = errorsToDisplay[0];
</script>

{#if errorsToDisplay.length > 0}
  {#if single}
    <div class="text-red-600 text-sm font-medium">{name} {error.caption}</div>
  {:else}
    <ul class="text-red-600 text-sm font-medium">
      {#each errorsToDisplay as err}
        <li>{err.caption}</li>
      {/each}
    </ul>
  {/if}
{/if}
