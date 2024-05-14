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
        plugins: { prettier, reactHooks },
        rules: {
            'react/prop-types': 'off',
            'react/no-deprecated': 'off',
            'react/no-string-refs': 'off'
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
];
