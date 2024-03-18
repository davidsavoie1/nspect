<script context="module">
  import { twMerge } from "tailwind-merge";
</script>

<script>
  export let message = undefined;
  export let el = "div",
    prefix = undefined;
</script>

{#if message}
  <svelte:element
    this={el}
    class={twMerge("text-red-600 text-sm font-medium", $$restProps.class)}
  >
    {#if prefix}
      {prefix}
    {/if}

    {message}
  </svelte:element>
{/if}
