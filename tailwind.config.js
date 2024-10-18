import { nextui } from '@nextui-org/react';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './client/**/*.{js,ts,jsx,tsx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontSize: {
            xs: '0.6rem',
            sm: '0.8rem',
            base: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem'
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
                emphasis: '#dc4787',
                info: '#0dcaf0',
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
        nextui({
            themes: {
                dark: {
                    colors: {
                        primary: '#41658a',
                        danger: '#dc3545',
                        warning: '#ffc107',
                        success: '#198754'
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
