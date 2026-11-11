import { heroui } from '@heroui/react';
import plugin from 'tailwindcss/plugin';

const scaled = (rem) => `calc(var(--font-scale, var(--text-scale, 1)) * ${rem}rem)`;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './client/**/*.{js,ts,jsx,tsx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontSize: {
            xs: [scaled(0.6), scaled(0.6)],
            sm: [scaled(0.8), scaled(0.8)],
            base: [scaled(1), scaled(1)],
            xl: [scaled(1.25), scaled(1.25)],
            '2xl': [scaled(1.563), scaled(1.563)],
            '3xl': [scaled(1.953), scaled(1.953)],
            '4xl': [scaled(2.441), scaled(2.441)],
            '5xl': [scaled(3.052), scaled(3.052)]
        },
        textStroke: {
            sm: 0.15,
            md: 0.3,
            lg: 0.45
        },
        extend: {
            cursor: {
                select: 'url(./client/assets/img/crosshairs.cur), default'
            },
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
            layout: {
                fontSize: {
                    tiny: scaled(0.75),
                    small: scaled(0.875),
                    medium: scaled(1),
                    large: scaled(1.125)
                },
                lineHeight: {
                    tiny: scaled(1),
                    small: scaled(1.25),
                    medium: scaled(1.5),
                    large: scaled(1.75)
                }
            },
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
        plugin(function ({ addUtilities, matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value
                    })
                },
                { values: theme('textShadow') }
            );
            addUtilities({
                '.hud-zoom': {
                    zoom: 'var(--ui-scale, 1)',
                    '--font-scale': '1',
                    'font-size': '1rem'
                },
                '.hud-text': {
                    'font-size': 'calc(var(--text-scale, 1) * 1rem)'
                },
                '.card-text': {
                    'font-size': 'calc(var(--text-scale, 1) * 0.875rem)',
                    'line-height': '1.25'
                },
                '.card-text-sm': {
                    'font-size': 'calc(var(--text-scale, 1) * 0.75rem)',
                    'line-height': '1.25'
                },
                '.card-text-xs': {
                    'font-size': 'calc(var(--text-scale, 1) * 0.625rem)',
                    'line-height': '1.25'
                },
                '.card-box': {
                    width: 'calc(var(--card-scale, 1) * 4rem)',
                    height: 'calc(var(--card-scale, 1) * 5.6rem)',
                    'border-radius': 'calc(var(--card-scale, 1) * 0.25rem)'
                },
                '.card-box-horizontal': {
                    width: 'calc(var(--card-scale, 1) * 5.6rem)',
                    height: 'calc(var(--card-scale, 1) * 4rem)',
                    'border-radius': 'calc(var(--card-scale, 1) * 0.25rem)'
                },
                '.card-box-rotated': {
                    transform:
                        'rotate(90deg) translate(calc(var(--card-scale, 1) * -0.8rem), calc(var(--card-scale, 1) * -0.8rem))'
                },
                '.card-box-kneeled': {
                    'margin-bottom': 'calc(var(--card-scale, 1) * 1.6rem)'
                },
                '.card-attachment': {
                    'margin-top': 'calc(var(--card-scale, 1) * -5.04rem)'
                },
                '.card-duplicate': {
                    'margin-bottom': 'calc(var(--card-scale, 1) * -5.04rem)'
                },
                '.card-duplicate-offset': {
                    'margin-top': 'calc(var(--card-scale, 1) * 0.56rem)'
                },
                '.card-additional-agenda': {
                    'margin-left': 'calc(var(--card-scale, 1) * -2rem)'
                }
            });
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
    ]
};
