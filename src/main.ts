import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// import VueLazyload from "vue-lazyload";
import vueLazysizes from 'vue-lazysizes';



const app = createApp(App);

app.use(VueSweetalert2);
// app.use(VueLazyload);
// @ts-ignore
store.$app = app;

app
  // .use(VueLazyload)
  .use(store)
  .use(router)
  .directive('lazysizes',vueLazysizes)
  .mount("#app");
