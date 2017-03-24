module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "env": {
        "browser": true,
        "es6": true,
        "jest": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            2,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [ "off", {"allow": ["error","warn"]} ]
    }
};
