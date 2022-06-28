import { routes } from "./router";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

import "ant-design-vue/dist/antd.less";
import "./styles/theme.less";
import "./styles/index.less";

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

createApp(App).use(router).mount("#app");
