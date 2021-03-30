module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": [
        "airbnb-typescript/base",
        "eslint-config-prettier",
        "eslint-config-prettier/@typescript-eslint"
    ],
    "parserOptions": {
        "project": "./tsconfig.json",
        "ecmaVersion": 2019,
        "sourceType": "module"
    },
    "ignorePatterns": [
        "webpack.dev.js", 
        "webpack.prod.js", 
        "./dist", 
        ".eslintrc.js"
    ]
};