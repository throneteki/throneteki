import { heroui } from '@heroui/react';
import plugin from 'tailwindcss/plugin';
import { cardSizes } from './client/constants';

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
        cardSize: cardSizes,
        textStroke: {
            sm: 0.15,
            md: 0.3,
            lg: 0.45
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
            matchUtilities(
                {
                    card: (value) => ({
                        width: `${value[0]}rem`,
                        height: `${value[1]}rem`,
                        'border-radius': `${value[0] / 16}rem`
                    }),
                    'card-horizontal': (value) => ({
                        width: `${value[1]}rem`,
                        height: `${value[0]}rem`,
                        'border-radius': `${value[0] / 16}rem`
                    }),
                    'card-rotated': (value) => {
                        const translateValue = (value[0] - value[1]) / 2;
                        return {
                            transform: `rotate(90deg) translate(${translateValue}rem, ${translateValue}rem)`
                        };
                    },
                    'card-kneeled': (value) => ({
                        'margin-bottom': `${value[1] - value[0]}rem`
                    }),
                    attachment: (value) => ({
                        'margin-top': `${value[1] * -0.9}rem`
                    }),
                    duplicate: (value) => ({
                        'margin-bottom': `${value[1] * -0.9}rem`
                    }),
                    'duplicate-offset': (value) => ({
                        'margin-top': `${value[1] * 0.1}rem`
                    })
                },
                {
                    values: theme('cardSize')
                }
            );
            matchUtilities(
                {
                    'text-stroke': (value) => ({
                        WebkitTextStroke: `${value}em black`,
                        paintOrder: 'stroke fill'
                    })
                },
                {
                    values: theme('textStroke')
                }
            );
        })
    ],
    safelist: [
        {
            pattern: /card-+/
        },
        {
            pattern: /attachment-+/
        },
        {
            pattern: /duplicate-+/
        }
    ]
};
