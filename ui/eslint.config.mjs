// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        // Parse pug templates so template bindings are visible to eslint
        templateTokenizer: { pug: "vue-eslint-parser-template-tokenizer-pug" },
      },
    },
    rules: {
      // HTML-formatting rules have no meaning in pug templates
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      "vue/html-quotes": "off",
      "vue/max-attributes-per-line": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
)
