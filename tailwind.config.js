import { heroui } from '@heroui/react';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './client/**/*.{js,ts,jsx,tsx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontSize: {
            xs: ['0.6rem', '0.6rem'],
            sm: ['0.8rem', '0.8rem'],
            base: ['1rem', '1rem'],
            xl: ['1.25rem', '1.25rem'],
            '2xl': ['1.563rem', '1.563rem'],
            '3xl': ['1.953rem', '1.953rem'],
            '4xl': ['2.441rem', '2.441rem'],
            '5xl': ['3.052rem', '3.052rem']
        },
        extend: {
            colors: {
                baratheon: '#e3d852',
                greyjoy: '#1d7a99',
                lannister: '#c00106',
                martell: '#e89521',
                neutral: '#a99560',
                stark: '#cfcfcf',
                targaryen: '#e54141',
                thenightswatch: '#7a7a7a',
                tyrell: '#509f16',
                secondary: '#DA8A2A',
                military: '#c72229',
                intrigue: '#05552f',
                power: '#2a2e5e'
            },
            flexGrow: {
                2: '2',
                3: '3'
            },
            boxShadow: {
                selected: '0 0 1px 4px'
            },
            textShadow: {
                sm: '0 1px 2px var(--tw-shadow-color)',
                DEFAULT: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)'
            }
        },
        container: {
            center: true
        }
    },
    plugins: [
        heroui({
            themes: {
                dark: {
                    colors: {
                        primary: '#41658a',
                        danger: '#dc3545',
                        ['danger-subtle']: {
                            DEFAULT: '#f8d7da',
                            foreground: '#842029'
                        },
                        warning: '#ffc107',
                        ['warning-subtle']: {
                            DEFAULT: '#fff3cd',
                            foreground: '#664d03'
                        },
                        success: {
                            DEFAULT: '#198754',
                            foreground: 'white'
                        },
                        ['success-subtle']: {
                            DEFAULT: '#d1e7dd',
                            foreground: '#0f5132'
                        },
                        info: {
                            DEFAULT: '#0dcaf0',
                            foreground: '#333333'
                        },
                        ['info-subtle']: {
                            DEFAULT: '#cff4fc',
                            foreground: '#055160'
                        }
                    }
                }
            }
        }),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value
                    })
                },
                { values: theme('textShadow') }
            );
        })
    ]
};
