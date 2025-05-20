import React from 'react';
import classNames from 'classnames';
import { Constants } from '../../constants';

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
        event: 'bg-event',
        'text-white': true
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
        'rounded-xl font-[thronesdb] inline text-center leading-6',
        withBackground ? bgClasses[color || icon] : fgClasses[color || icon],
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

    return <span className={wrapperClassName}>{iconText[icon]}</span>;
};

export default ThronesIcon;
