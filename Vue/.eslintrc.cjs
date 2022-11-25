module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    // "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    // "off"或0- 关闭规则
    // "warn"或1- 开启规则，使用警告级别的错误：warn(不会导致程序退出)
    // "error"或2- 开启规则，使用错误级别的错误：error(当被触发的时候，程序会退出)
    "prettier/prettier": "error",
    "vue/multi-word-component-names": "off", //组件名称不应该只有一个单词。
    // "@typescript-eslint/ban-ts-comment": "off",
  },
};
