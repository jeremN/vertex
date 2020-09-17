module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": ["airbnb-typescript/base"],
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    "ignorePatterns": ["webpack.dev.js", "webpack.prod.js", "./dist", ".eslintrc.js"]
};