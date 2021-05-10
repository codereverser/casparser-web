import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import Button from "primevue/button";
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import InputSwitch from "primevue/inputswitch";
import Panel from "primevue/panel";
import Password from "primevue/password";
import ProgressBar from "primevue/progressbar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

import "primevue/resources/themes/saga-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const app = createApp(App);

app.use(PrimeVue);
app.component("Button", Button);
app.component("Card", Card);
app.component("Column", Column);
app.component("DataTable", DataTable);
app.component("Fieldset", Fieldset);
app.component("FileUpload", FileUpload);
app.component("InputSwitch", InputSwitch);
app.component("Panel", Panel);
app.component("Password", Password);
app.component("ProgressBar", ProgressBar);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);

app.mount("#app");
