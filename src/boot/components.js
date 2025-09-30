import { defineBoot } from "#q-app/wrappers";
import Modal from "src/components/Modal.vue";
import VLabel from "src/components/Label/VLabel.vue";
import InputCheck from "src/components/InputCheck.vue";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-webpack/boot-files
export default defineBoot(async ({ app, router }) => {
  app.component("modal", Modal);
  app.component("v-label", VLabel);
  app.component("v-input-check", InputCheck);
});
