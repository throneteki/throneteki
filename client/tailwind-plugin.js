import plugin from 'tailwindcss/plugin';

const textStroke = { sm: 0.15, md: 0.3, lg: 0.45 };

// The game board's own type scale, tighter than the site's: text-xs and the rest take these steps inside the board
// (hud-text) and its panels (hud-zoom), and the site's steps everywhere else
const boardSteps = Object.fromEntries(
    Object.entries({
        xs: 0.6,
        sm: 0.8,
        base: 1,
        lg: 1.125,
        xl: 1.25,
        '2xl': 1.563,
        '3xl': 1.953
    }).flatMap(([step, rem]) => [
        [`--step-${step}`, `${rem}rem`],
        [`--lead-${step}`, `${rem}rem`]
    ])
);

export default plugin(function ({ addUtilities, matchUtilities }) {
    addUtilities({
        '.hud-zoom': {
            ...boardSteps,
            zoom: 'var(--ui-scale, 1)',
            '--font-scale': '1',
            'font-size': '1rem'
        },
        '.hud-text': {
            ...boardSteps,
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
        { values: textStroke }
    );
});
