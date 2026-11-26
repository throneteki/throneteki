import plugin from 'tailwindcss/plugin';
import { cardSizes } from './constants';

const textStroke = { sm: 0.15, md: 0.3, lg: 0.45 };

export default plugin(function ({ matchUtilities }) {
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
            }),
            'additional-agenda': (value) => ({
                'margin-left': `-${value[0] / 2}rem`
            })
        },
        { values: cardSizes }
    );
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
