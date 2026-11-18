import React from 'react';

import classNames from 'classnames';

const StatContainer = ({ children, title = null, className, height = 'h-8', style }) => {
    return (
        <div
            title={title}
            style={style}
            className={classNames(
                'flex min-w-fit items-center border-r-2 border-r-gray-200/50 last-of-type:border-none',
                height,
                className
            )}
        >
            {children}
        </div>
    );
};

export default StatContainer;
