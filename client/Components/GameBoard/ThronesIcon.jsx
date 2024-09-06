import React from 'react';
import classNames from 'classnames';

const ThronesIcon = ({ icon, withBackground = false }) => {
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
        'w-6 h-6 rounded-xl font-[thronesdb]',
        withBackground ? bgClasses[icon] : fgClasses[icon]
    );

    const iconText = {
        military: '',
        power: '',
        intrigue: ''
    };

    return <div className={className}>{iconText[icon]}</div>;
};

export default ThronesIcon;
