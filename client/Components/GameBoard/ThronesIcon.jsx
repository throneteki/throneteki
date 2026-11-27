import React from 'react';
import classNames from 'classnames';
import { Constants } from '../../constants';

// Where the font draws a glyph off the middle of its box, the nudge (in em) that centres it on a disc
const discNudge = {
    military: '0.02em -0.028em',
    intrigue: '0.026em -0.069em',
    power: '0.006em 0.017em'
};

const ThronesIcon = ({ className, icon, color, noSize = true, withBackground = false }) => {
    const bgClasses = {
        military: 'bg-military',
        power: 'bg-power',
        intrigue: 'bg-intrigue',
        baratheon: 'bg-baratheon',
        greyjoy: 'bg-greyjoy',
        lannister: 'bg-lannister',
        martell: 'bg-martell',
        stark: 'bg-stark',
        thenightswatch: 'bg-thenightswatch',
        targaryen: 'bg-targaryen',
        tyrell: 'bg-tyrell',
        neutral: 'bg-neutral',
        agenda: 'bg-agenda',
        plot: 'bg-plot',
        character: 'bg-character',
        attachment: 'bg-attachment',
        location: 'bg-location',
        event: 'bg-event'
    };

    const fgClasses = {
        ...Constants.ColorClassByFaction,
        military: 'text-military',
        power: 'text-power',
        intrigue: 'text-intrigue',
        agenda: 'text-agenda',
        plot: 'text-plot',
        character: 'text-character',
        attachment: 'text-attachment',
        location: 'text-location',
        event: 'text-event'
    };

    const wrapperClassName = classNames(
        'rounded-xl font-icons inline text-center leading-6',
        withBackground
            ? classNames(bgClasses[color || icon], 'text-ink')
            : fgClasses[color || icon],
        {
            'w-6 h-6': !noSize
        },
        className
    );

    const iconText = {
        military: '',
        power: '',
        intrigue: '',
        baratheon: '',
        greyjoy: '',
        lannister: '',
        martell: '',
        stark: '',
        thenightswatch: '',
        targaryen: '',
        tyrell: '',
        neutral: '',
        agenda: '',
        plot: '',
        character: '',
        attachment: '',
        location: '',
        event: ''
    };

    // A disc and its glyph are game art, drawn the same in either theme
    return (
        <span data-theme={withBackground ? 'dark' : undefined} className={wrapperClassName}>
            {withBackground && discNudge[icon] ? (
                <span className='inline-block' style={{ translate: discNudge[icon] }}>
                    {iconText[icon]}
                </span>
            ) : (
                iconText[icon]
            )}
        </span>
    );
};

export default ThronesIcon;
