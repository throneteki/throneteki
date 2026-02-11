import React from 'react';
import Counter from './Counter';
import classNames from 'classnames';

const CardCounters = ({ counters, isParentKneeled }) => {
    if (counters.length === 0) {
        return null;
    }

    let counterDivs = [];

    for (const [key, counter] of Object.entries(counters)) {
        counterDivs.push(
            <Counter
                key={key}
                name={counter.name}
                icon={counter.icon}
                value={counter.count}
                fade={counter.fade}
                cancel={counter.cancel}
                shortName={counter.shortName}
            />
        );
    }

    const classes = classNames(
        'w-full h-full flex items-center z-[200] justify-center absolute left-0 top-0 pointer-events-none',
        { '-rotate-90': isParentKneeled }
    );

    return (
        <div className={classes}>
            <div className='text-white justify-center flex flex-wrap items-center gap-1 h-auto w-full flex-row'>
                {counterDivs}
            </div>
        </div>
    );
};

export default CardCounters;
