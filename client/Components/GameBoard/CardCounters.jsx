import React from 'react';
import classNames from 'classnames';
import Counter from './Counter';

const CardCounters = ({ counters }) => {
    if (counters.length === 0) {
        return null;
    }

    let countersClass = classNames(
        'text-white justify-center flex flex-wrap items-center gap-1 h-auto flex-row',
        'ignore-mouse-events',
        {
            'w-3/4': counters.length <= 4,
            'w-full': counters.length > 4
        }
    );

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

    return (
        <div className='w-full h-full flex items-center justify-center absolute top-0 left-0 z-20'>
            <div className={countersClass}>{counterDivs}</div>
        </div>
    );
};

export default CardCounters;
