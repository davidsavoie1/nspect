<script context="module">
  import { twMerge } from "tailwind-merge";
  import { clsInputMaybeError } from "./classes";

  import FieldError from "./FieldError.svelte";
  import Nspector from "./Nspector.svelte";
</script>

<script>
  export let choices = [];
  export let type = undefined;
  export let inspection = [];
</script>

<table
  class="border rounded w-full border-separate border-spacing-0 text-left text-sm"
>
  <thead>
    <tr>
      <th class="px-1 py-0.5">Valeur</th>
      <th>Valeur de nomenclature</th>
    </tr>
  </thead>

  <tbody>
    {#each choices as choice, index (choice._id)}
      <tr>
        <Nspector res={inspection?.[index]?.["value"]} let:invalid let:message>
          <td>
            {#if ["NUMBER", "INTEGER"].includes(type)}
              <input
                class={twMerge(
                  clsInputMaybeError(invalid),
                  "w-full px-1 py-0.5 rounded-none"
                )}
                type="number"
                step={type === "INTEGER" ? 1 : null}
                bind:value={choice.value}
                on:blur={(e) => {
                  if (!e.target.value) {
                    choices = choices.filter((ch, idx) => idx !== index);
                  }
                }}
              />
            {:else}
              <input
                class={twMerge(
                  clsInputMaybeError(invalid),
                  "w-full px-1 py-0.5 rounded-none"
                )}
                type="text"
                bind:value={choice.value}
                on:blur={(e) => {
                  if (!e.target.value) {
                    choices = choices.filter((ch, idx) => idx !== index);
                  }
                }}
              />
            {/if}

            <FieldError {message} />
          </td>
        </Nspector>

        <Nspector
          res={inspection?.[index]?.["nomenclatureValue"]}
          let:invalid
          let:message
        >
          <td>
            <input
              class={twMerge(
                clsInputMaybeError(invalid),
                "w-full px-1 py-0.5 rounded-none"
              )}
              type="number"
              bind:value={choice.nomenclatureValue}
            />

            <FieldError {message} />
          </td>
        </Nspector>
      </tr>
    {/each}
  </tbody>
</table>
