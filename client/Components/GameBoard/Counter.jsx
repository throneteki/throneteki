import React, { useCallback } from 'react';
import classNames from 'classnames';

const Counter = ({ name, cancel, fade, icon, shortName, value }) => {
    const getClassName = useCallback(() => {
        return classNames('counter', `${name}-token`, {
            cancel: cancel,
            'fade-out': fade
        });
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
            {shortName ? <span>{shortName}</span> : null}
            <span>{value}</span>
        </div>
    );
};

export default Counter;
