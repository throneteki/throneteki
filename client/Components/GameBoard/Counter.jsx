import React, { useCallback } from 'react';
import classNames from 'classnames';

const Counter = ({ name, cancel, fade, icon, shortName, value }) => {
    const getClassName = useCallback(() => {
        return classNames(
            'p-0 text-sm w-6 h-6 flex justify-center items-center rounded-md ',
            `${name}-token`,
            {
                'bg-success-200': name === 'dupe',
                'bg-red-700': name === 'strength',
                cancel: cancel,
                'fade-out': fade
            }
        );
    }, [name, cancel, fade]);

    const className = getClassName();

    if (icon) {
        return (
            <div
                key={icon}
                className={classNames(className, 'thronesicon', `thronesicon-${icon}`)}
            />
        );
    }

    return (
        <div key={name} className={className}>
            {shortName}
            {value}
        </div>
    );
};

export default Counter;
