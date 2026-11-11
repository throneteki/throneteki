import React from 'react';
import Counter from './Counter';

const containerStyle = {
    '--counter-size': 'calc(var(--ui-scale, 1) * 1.5rem)'
};

const CardCounters = ({ counters }) => {
    if (counters.length === 0) {
        return null;
    }

    return (
        <div
            className='absolute inset-0 z-[230] flex flex-wrap items-center justify-center content-center gap-0.5 p-0.5 text-white pointer-events-none'
            style={containerStyle}
        >
            {counters.map((counter, index) => (
                <Counter
                    key={index}
                    name={counter.name}
                    icon={counter.icon}
                    value={counter.count}
                    fade={counter.fade}
                    cancel={counter.cancel}
                    shortName={counter.shortName}
                />
            ))}
        </div>
    );
};

export default CardCounters;
