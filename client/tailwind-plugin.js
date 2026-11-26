import plugin from 'tailwindcss/plugin';

const textStroke = { sm: 0.15, md: 0.3, lg: 0.45 };

export default plugin(function ({ addUtilities, matchUtilities }) {
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
        { values: textStroke }
    );
});
