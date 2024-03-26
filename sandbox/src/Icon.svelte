<script context="module">
  import { twMerge } from "tailwind-merge";
</script>

<script>
  let className = "";
  export { className as class };
  export let icon = undefined;
  export let alt = undefined, // Alternative hidden text for screen readers
    animation = false,
    border = false,
    color = undefined,
    flip = false,
    iconClass = undefined,
    rotate = false, // 90, 180, 270
    family = undefined, // sharp*, brands*
    fixedWidth = false,
    inverse = false,
    pull = false, // left, right
    regular = false,
    size = undefined, // https://fontawesome.com/docs/web/style/size
    spin = false;

  // *pro only

  $: style = color
    ? color.startsWith("--")
      ? `color: var(${color})`
      : `--icon-color: ${color}`
    : null;

  $: isRegular = regular || icon?.indexOf("regular") >= 0;
</script>

{#if icon}
  <span class={className}>
    <i
      class={twMerge(
        `fa-${isRegular ? "regular" : "solid"}`,
        `fa-${icon.replace(/[ -_]*regular[ -_]*/, "")}`,
        animation && `fa-${animation}`,
        border && "fa-border",
        family && `fa-${family}`,
        fixedWidth && "fa-fw",
        flip && `fa-flip-${flip}`,
        inverse && "fa-inverse",
        pull && `fa-pull-${pull}`,
        rotate && `fa-rotate-${rotate}`,
        size && `fa-${size}`,
        spin && "fa-spin",
        iconClass
      )}
      aria-hidden="true"
      {style}
      {...$$restProps}
    />

    {#if alt}
      <span class="fa-sr-only">{alt}</span>
    {/if}
  </span>
{/if}

<style>
  i {
    color: var(--icon-color);
    margin: 0;
  }
</style>
