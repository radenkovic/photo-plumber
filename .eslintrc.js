module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
   },
  plugins: ['prettier'],
  extends: ['plugin:import/errors', "prettier"],
  rules: {
    "prettier/prettier": ["error", { "singleQuote": true }]
  }
}