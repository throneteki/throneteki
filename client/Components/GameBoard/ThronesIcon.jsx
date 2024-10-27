import React from 'react';
import classNames from 'classnames';

const ThronesIcon = ({ icon, noSize = true, withBackground = false }) => {
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
        event: 'bg-event',
        'text-white': true
    };

    const fgClasses = {
        military: 'text-military',
        power: 'text-power',
        intrigue: 'text-intrigue',
        baratheon: 'text-baratheon',
        greyjoy: 'text-greyjoy',
        lannister: 'text-lannister',
        martell: 'text-martell',
        stark: 'text-stark',
        thenightswatch: 'text-thenightswatch',
        targaryen: 'text-targaryen',
        tyrell: 'text-tyrell',
        neutral: 'text-neutral',
        agenda: 'text-agenda',
        plot: 'text-plot',
        character: 'text-character',
        attachment: 'text-attachment',
        location: 'text-location',
        event: 'text-event'
    };

    const className = classNames(
        'rounded-xl font-[thronesdb] inline text-center leading-6',
        withBackground ? bgClasses[icon] : fgClasses[icon],
        {
            'w-6 h-6': !noSize
        }
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

    return <div className={className}>{iconText[icon]}</div>;
};

export default ThronesIcon;
