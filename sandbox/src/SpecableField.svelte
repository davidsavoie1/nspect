<script context="module">
  import { twMerge } from "tailwind-merge";
  import { clsInput, clsInputError, clsLabel } from "./classes";

  import Icon from "./Icon.svelte";
  // import Select from "./Select";
  // import SelectMulti from "./SelectMulti.svelte";
  // import DateTimeInput from "./DateTimeInput.svelte";

  /* Defaults a nil or empty string value to a default one */
  const defaultTo = (defaultValue) => (value) =>
    [null, undefined, ""].includes(value) ? defaultValue : value;
</script>

<script>
  let className = "";
  export { className as class };
  export let specable;
  export let caption = undefined,
    classLabel = "",
    classPrompt = "",
    coerceMinMax = false,
    divClass = undefined,
    emptyValue = undefined,
    id = `${specable?.id}-${(Math.random() * 1e9).toFixed()}`,
    icon = undefined,
    iconClass = undefined,
    inputClass = undefined,
    label = undefined,
    prompt = true,
    readonly = undefined,
    select = undefined, // <Select {...select} /> when defined
    textarea = false,
    textareaClass = undefined,
    type = "text",
    toInput = defaultTo(""),
    toValue =
      type === "number" ? (i) => (i ? +i : emptyValue) : defaultTo(emptyValue),
    use = () => {}; // (element)
  // export let handlers = {};

  $: ({ handlers: selectHandlers, multi, ...selectProps } = select || {});

  $: ({ active, changed, error, valid, validating, value } = $specable);
  $: required = specable.isRequired;

  $: setValue = (v) => specable.set(toValue(v));
  $: onInput = ({ target }) => {
    const input = target?.value;
    if (!input || type !== "number" || !coerceMinMax) return setValue(input);

    const min = target.getAttribute("min") || -Infinity;
    const max = target.getAttribute("max") || Infinity;
    const coercedVal = Math.min(+max, Math.max(+min, +input));
    const coercedInput = `${coercedVal}`;
    target.value = coercedInput;
    setValue(coercedInput);
  };

  // function activateDelayed() {
  //   setTimeout(() => !readonly && specable.activate(), 200);
  // }
</script>

<div class={twMerge("space-y-1", className)}>
  <slot name="label" {id}>
    {#if label}
      <label
        for={id}
        color={error && "red"}
        class={twMerge(clsLabel, "block", classLabel)}
      >
        {label}
        {#if required}
          <span class="text-red-500">*</span>
        {/if}

        <slot name="afterLabel" />
      </label>
    {/if}
  </slot>

  <slot
    {active}
    {changed}
    {error}
    {id}
    input={toInput(value)}
    {required}
    store={specable}
    {valid}
    {validating}
    {value}
    {onInput}
  >
    {#if selectProps?.items?.length > 0}
      {#if multi}
        <!-- <SelectMulti
          {error}
          {id}
          {readonly}
          {required}
          type="text"
          {...$$restProps}
          {...selectProps}
          values={value}
          handlers={{
            ...selectHandlers,
            onChange: (values) => {
              setValue(values);
              selectHandlers?.onChange?.(values);
            },
          }}
          on:blur={activateDelayed}
        /> -->
      {:else}
        <!-- <Select
          {error}
          {id}
          {readonly}
          {required}
          type="text"
          {...$$restProps}
          {...selectProps}
          {value}
          handlers={{
            ...selectHandlers,
            onChange: (datum) => {
              setValue(datum.value);
              selectHandlers?.onChange?.(datum);
            },
          }}
          on:blur={activateDelayed}
        /> -->
      {/if}
    {:else if textarea}
      <textarea
        {id}
        color={error ? "red" : undefined}
        class={twMerge(clsInput, error && clsInputError, textareaClass)}
        {readonly}
        {required}
        value={toInput(value)}
        {...$$restProps}
        on:input={onInput}
        on:blur={() => specable.activate()}
        use:use
      />
    {:else if ["date", "datetime", "time"].includes(type)}
      <!-- <DateTimeInput
        {error}
        {...$$restProps}
        {readonly}
        {required}
        {type}
        {value}
        onChange={(arg) => {
          const { time, value: v } = arg;
          specable.set(toValue(type === "time" ? time : v, true));
          handlers?.onChange?.(arg);
        }}
        on:blur={activateDelayed}
      /> -->
    {:else}
      <div class={twMerge("relative", divClass)}>
        {#if icon}
          <Icon
            {icon}
            class={twMerge("absolute right-0 top-0 py-2.5 px-3", iconClass)}
          />
        {/if}

        <input
          {id}
          class={twMerge(
            clsInput,
            icon && "pr-9",
            error && clsInputError,
            inputClass
          )}
          {readonly}
          {required}
          {type}
          {...$$restProps}
          value={toInput(value)}
          on:input={onInput}
          on:blur={() => specable.activate()}
          on:blur
          on:focus
          use:use
        />

        <slot name="after" />
      </div>
    {/if}
  </slot>

  {#if prompt && error}
    <p
      class={twMerge(
        "text-xs font-normal text-red-700 dark:text-red-500 px-2",
        classPrompt
      )}
      color="red"
    >
      {[caption, error].filter((x) => x).join(" ")}
    </p>
  {/if}
</div>
