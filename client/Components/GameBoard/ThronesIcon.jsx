import React from 'react';
import classNames from 'classnames';

const ThronesIcon = ({ icon, noSize = true, withBackground = false }) => {
    const bgClasses = {
        military: 'bg-military',
        power: 'bg-power',
        intrigue: 'bg-intrigue',
        'text-white': true
    };

    const fgClasses = {
        military: 'text-military',
        power: 'text-power',
        intrigue: 'text-intrigue'
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
        intrigue: ''
    };

    return <div className={className}>{iconText[icon]}</div>;
};

export default ThronesIcon;
