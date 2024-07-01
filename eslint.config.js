import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    reactRecommended,
    prettierRecommended,
    {
        plugins: {
            'react-hooks': reactHooks
        },

        rules: {
            ...reactHooks.configs.recommended.rules
        }
    },
    {
        files: ['client/**/*.jsx', 'server/**/*.js', 'test/server/**/*.js'],
        ignores: ['coverage'],
        languageOptions: {
            ...reactRecommended.languageOptions,
            globals: {
                ...globals.browser,
                ...globals.node
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: { prettier },
        rules: {
            'react/prop-types': 'off',
            'react/no-deprecated': 'off',
            'react/no-string-refs': 'off',
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ]
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
];
