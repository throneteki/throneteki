import React from 'react';
import Counter from './Counter';

const CardCounters = ({ counters }) => {
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

    return (
        <div className='w-full h-full flex items-center justify-center absolute left-0 top-0 z-10 pointer-events-none'>
            <div className='text-white justify-center flex flex-wrap items-center gap-1 h-auto w-full flex-row'>
                {counterDivs}
            </div>
        </div>
    );
};

export default CardCounters;
