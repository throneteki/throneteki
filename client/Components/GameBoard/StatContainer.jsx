import React from 'react';

const StatContainer = ({ children, title = null }) => {
    return (
        <div
            title={title}
            className='flex h-8 min-w-fit items-center border-r border-r-gold-hair last-of-type:border-none'
        >
            {children}
        </div>
    );
};

export default StatContainer;
