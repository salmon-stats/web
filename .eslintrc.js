const STRICT_CHECKING = true;

const extendsOptions = [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended"
];

if (STRICT_CHECKING) {
  extendsOptions.push("plugin:@typescript-eslint/recommended-requiring-type-checking");
}

module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": extendsOptions,
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "project": "tsconfig.json",
        "sourceType": "module",
        "extraFileExtensions": [".vue"]
    },
    "plugins": [
        "@typescript-eslint",
        "prefer-arrow",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        "@typescript-eslint/adjacent-overload-signatures": "warn",
        "@typescript-eslint/array-type": [
            "warn",
            {
                "default": "array-simple"
            }
        ],
        "@typescript-eslint/ban-types": [
            "warn",
            {
                "types": {
                    "Object": {
                        "message": "Avoid using the `Object` type. Did you mean `object`?"
                    },
                    "Function": {
                        "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
                    },
                    "Boolean": {
                        "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
                    },
                    "Number": {
                        "message": "Avoid using the `Number` type. Did you mean `number`?"
                    },
                    "String": {
                        "message": "Avoid using the `String` type. Did you mean `string`?"
                    },
                    "Symbol": {
                        "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
                    }
                }
            }
        ],
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/class-name-casing": "warn",
        // "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/consistent-type-definitions": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        // "@typescript-eslint/explicit-member-accessibility": [
        //     "warn",
        //     {
        //         "accessibility": "explicit"
        //     }
        // ],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "warn",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-new": "warn",
        "@typescript-eslint/no-namespace": "warn",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-function-type": "warn",
        "@typescript-eslint/prefer-namespace-keyword": "warn",
        "@typescript-eslint/triple-slash-reference": [
            "warn",
            {
                "path": "always",
                "types": "prefer-import",
                "lib": "always"
            }
        ],
        "@typescript-eslint/type-annotation-spacing": "warn",
        "@typescript-eslint/unified-signatures": "warn",

        "vue/attributes-order": "off",
        "vue/max-attributes-per-line": "off",
        "vue/html-self-closing": "off",
        "vue/no-multiple-template-root": "off", // false positive
        "vue/singleline-html-element-content-newline": "off",

        "arrow-body-style": "warn",
        "brace-style": [
            "warn",
            "1tbs"
        ],
        "complexity": "off",
        "constructor-super": "warn",
        "curly": "warn",
        "dot-notation": "warn",
        "eol-last": "warn",
        "eqeqeq": [
            "warn",
            "smart"
        ],
        "guard-for-in": "warn",
        "id-blacklist": [
            "warn",
            "any",
            "number",
            "string",
            "boolean",
            "Undefined"
        ],
        "id-match": "warn",
        "import/order": "off",
        "max-classes-per-file": [
            "warn",
            1
        ],
        "new-parens": "warn",
        "no-bitwise": [
            "warn",
            {
                "int32Hint": true
            },
        ],
        "no-caller": "warn",
        "no-cond-assign": "warn",
        "no-console": "warn",
        "no-debugger": "warn",
        "no-empty": "warn",
        "no-eval": "warn",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "off",
        "no-new-wrappers": "warn",
        "no-shadow": [
            "warn",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "warn",
        // "no-trailing-spaces": "warn",
        "no-undef-init": "warn",
        "no-underscore-dangle": "warn",
        "no-unsafe-finally": "warn",
        // False positive on optional chaining: https://github.com/facebook/create-react-app/issues/8107
        // "no-unused-expressions": "warn",
        "no-unused-labels": "warn",
        "no-var": "warn",
        "object-shorthand": "warn",
        "one-var": [
            "warn",
            "never"
        ],
        "prefer-arrow/prefer-arrow-functions": "warn",
        "prefer-const": "warn",
        "quote-props": [
            "warn",
            "consistent-as-needed"
        ],
        "radix": "warn",
        "space-before-function-paren": [
            "warn",
            {
                "anonymous": "never",
                "asyncArrow": "always",
                "named": "never"
            }
        ],
        "spaced-comment": [
            "warn",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "use-isnan": "warn",
        "valid-typeof": "off"
    }
};
