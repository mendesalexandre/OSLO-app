import { defineBoot } from "#q-app/wrappers";

import {
  Notify,
  Loading,
  QInput,
  QCard,
  QSelect,
  QBtn,
  QIcon,
  QDialog,
} from "quasar";
// import InputCheck from "src/components/InputCheck.vue";
// import VIcon from "src/components/Icons/VIcon.vue";

const defaultQInput = {
  outlined: true,
  dense: true,
  color: "primary",
  hideBottomSpace: true,
};

const defaultQDialog = {
  persistent: true,
};

const defaultQSelect = {
  outlined: true,
  dense: true,
  color: "primary",
  // clearable: true,
  clearIcon: "eva-close-outline",
  dropdownIcon: "keyboard_arrow_down",
};

const defaultQCard = {
  // flat: true,
  outlined: true,
};

const defaultQBtn = {
  // bordered: true,
  // flat: true,
  outlined: true,
};

const defaultQIcon = {
  // bordered: true,
  // flat: true,
  outlined: true,
};

Notify.setDefaults({
  position: "top-right",
  // position: "top",
  timeout: 2500,
  textColor: "white",
  actions: [{ icon: "close", color: "white", round: true }],
  progress: true,
  spinnerColor: "white",
  icon: "eva-info-outline",
});

Loading.setDefaults({
  // spinner: QSpinnerIos,
  // spinnerSize: 200,
  spinnerColor: "white",
  message: "Carregando...",
  messageClass: "text-h6",
  // backgroundColor: "rgba(0, 0, 0, 0.1)",
});

// const defaultsQTable = {
//   "rows-per-page-options": [10, 20, 50, 100, 200, 0],
//   noDataLabel: "Nenhum dado disponível",
//   noResultsLabel: "Sem resultados",
//   loadingLabel: "Carregando...",
//   rowsPerPageLabel: "Linhas por página:",
//   allRowsLabel: "Todos (a)",
//   pagination: {
//     label: "Linhas:",
//     next: "Próximo",
//     prev: "Anterior",
//     first: "Primeiro",
//     last: "Último",
//   },
// };

function mapDefaultsToObject(defaultProps, objectType) {
  Object.keys(defaultProps).forEach((prop) => {
    objectType.props[prop] =
      Array.isArray(objectType.props[prop]) === true ||
      typeof objectType.props[prop] === "function"
        ? { type: objectType.props[prop], default: defaultProps[prop] }
        : { ...objectType.props[prop], default: defaultProps[prop] };
  });
}

export default defineBoot(({ app, router }) => {
  // mapDefaultsToObject(defaultsQTable, QTable);
  mapDefaultsToObject(defaultQInput, QInput);
  mapDefaultsToObject(defaultQSelect, QSelect);
  mapDefaultsToObject(defaultQCard, QCard);
  mapDefaultsToObject(defaultQBtn, QBtn);
  mapDefaultsToObject(defaultQIcon, QIcon);
  mapDefaultsToObject(defaultQDialog, QDialog);

  // app.component("v-input-check", InputCheck);
  // app.component("v-icone", VIcon);
});
