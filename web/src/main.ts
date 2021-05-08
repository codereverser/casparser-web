import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Card from "primevue/card";
import FileUpload from "primevue/fileupload";
import Password from "primevue/password";
import ProgressBar from "primevue/progressbar";

import "primevue/resources/themes/saga-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const app = createApp(App);

app.use(PrimeVue);
app.component("Button", Button);
app.component("Card", Card);
app.component("FileUpload", FileUpload);
app.component("Password", Password);
app.component("ProgressBar", ProgressBar);

app.mount("#app");
