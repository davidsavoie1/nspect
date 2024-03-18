<script context="module">
  import { explain } from "nspect";
</script>

<script>
  export let res = undefined;
  export let own = true;

  $: explained = explain(res);

  $: ({ errors, ownErrors } = explained);

  $: messages = ((own ? ownErrors : errors) || []).map((err) => err.message);

  $: message = messages[0];
</script>

<slot {...explained} {messages} {message} />
