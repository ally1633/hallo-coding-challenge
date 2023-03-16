module.exports = {
  extends: ["turbo", "prettier", "plugin:import/recommended"],
  rules: {
    "import/no-duplicates": ["error", { considerQueryString: true }],
    "import/no-unresolved": "off",
    "import/named": "off",
  },
};
