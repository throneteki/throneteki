import React, { useCallback } from 'react';
import classNames from 'classnames';
import ThronesIcon from './ThronesIcon';

import './Counter.css';

const Counter = ({ name, cancel, fade, icon, shortName, value, className }) => {
    const getClassName = useCallback(() => {
        return classNames(
            'p-0 text-sm w-6 h-6 flex justify-center items-center rounded-md',
            `${name}-token`,
            {
                'bg-success-100/85': name === 'dupe',
                'bg-red-800/85': name === 'strength' || name === 'blood',
                'bg-blue-900/85': name === 'card-power',
                'bg-gray-500/85': name === 'stand',
                'bg-yellow-900/85': name === 'poison',
                'bg-yellow-400/85': name === 'gold',
                'bg-gray-300/85': name === 'valarmorghulis',
                'bg-orange-800/85': name === 'betrayal' || name === 'journey',
                'bg-purple-800/85': name === 'vengeance' || name === 'shadow',
                'bg-lime-400/85': name === 'ear',
                'bg-purple-600/85': name === 'kiss',
                'bg-yellow-700/85': name === 'bell',
                'bg-white/85 text-black': name === 'prayer' || name === 'ghost',
                'bg-gray-400/85': name === 'tale',
                'bg-teal-600/85': name === 'venom',
                'bg-black/85': name === 'challenge-icon' || name === 'faction',
                'cancel relative': cancel,
                'fade-out': fade
            },
            className
        );
    }, [name, cancel, fade, className]);

    const counterClassName = getClassName();

    if (icon) {
        return (
            <div className={counterClassName}>
                <ThronesIcon icon={icon} noSize />
            </div>
        );
    }

    return (
        <div key={name} className={counterClassName}>
            {shortName}
            {value}
        </div>
    );
};

export default Counter;
