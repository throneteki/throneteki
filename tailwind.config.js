import { nextui } from '@nextui-org/react';

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
                targaryen: '#1c1c1c',
                thenightswatch: '#7a7a7a',
                tyrell: '#509f16',
                emphasis: '#dc4787',
                info: '#cff4fc',
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
                        primary: '#41658a'
                    }
                }
            }
        })
    ]
};
