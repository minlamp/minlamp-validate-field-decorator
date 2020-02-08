module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "commonjs": true,
        "jest": true // 测试文件会直接引入expect等函数，但是没定义，运行没问题，但是eslint会报错
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": 'module',
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        }
    },
    "plugins": ['react'],
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "settings": {
        "react": {
            "version": "latest"
        }
    },
    "rules": {
        // enable additional rules
        "indent": [0, "tab"],
        "linebreak-style": [0, "unix"],
        "quotes": [0, "single"],
        "semi": [0, "always"],

        // override default options for rules from base configurations
        "comma-dangle": [0, "always"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
        "no-unused-vars": 1,
        "react/prop-types": 0
    }
}
