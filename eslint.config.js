import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    reactRecommended,
    prettierRecommended,
    {
        files: ['client/**/*.jsx', 'server/**/*.js', 'test/server/**/*.js'],
        ignores: ['coverage'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: { react: react, prettier: prettier, reactHooks: reactHooks },
        rules: { 'react/prop-types': 'off' },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
];
