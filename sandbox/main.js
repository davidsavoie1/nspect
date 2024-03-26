import "./main.css";
import { setMessages } from "nspect";

setMessages({
  isInvalid: "est invalide",
  isMissing: "est nécessaire",
  isRequired: "est obligatoire",
});

// import "./src/experiment";

import App from "./src/AppSvelteSpecma.svelte";

new App({ target: document.getElementById("app") });
