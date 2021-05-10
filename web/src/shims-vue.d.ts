declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

// declare module "vue-json-pretty" {
//   import { Component } from "vue";
//   const VueJsonPretty: Component;
//   export default VueJsonPretty;
// }
