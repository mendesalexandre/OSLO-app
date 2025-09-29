import { defineBoot } from "#q-app/wrappers";
import axios from "axios";

const baseURL = "http://sistemaoslo.com.br/api";
const api = axios.create({ baseURL: baseURL });

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
