import React from 'react';
import Counter from './Counter';

const containerStyle = {
    '--counter-size': 'calc(var(--ui-scale, 1) * 1.5rem)'
};

// Tokens, power and dupes are placed one at a time, so several placed at once count up
const countsUp = (counter) => !counter.icon && counter.name !== 'strength';

// The same counter keeps the same key as others come and go, so a change pops the right one
const keysFor = (counters) => {
    const seen = new Map();
    return counters.map((counter) => {
        const base = `${counter.fade ? 'attached-' : ''}${counter.name}-${counter.icon ?? ''}`;
        const index = seen.get(base) ?? 0;
        seen.set(base, index + 1);
        return `${base}-${index}`;
    });
};

const CardCounters = ({ cardUuid, counters }) => {
    if (counters.length === 0) {
        return null;
    }

    const keys = keysFor(counters);
    return (
        <div
            data-card-overlay=''
            className='absolute inset-0 z-[230] flex flex-wrap items-center justify-center content-center gap-0.5 p-0.5 text-white pointer-events-none'
            style={containerStyle}
        >
            {counters.map((counter, index) => (
                <Counter
                    key={keys[index]}
                    id={`${cardUuid}:${keys[index]}`}
                    name={counter.name}
                    icon={counter.icon}
                    value={counter.count}
                    fade={counter.fade}
                    cancel={counter.cancel}
                    shortName={counter.shortName}
                    countsUp={countsUp(counter)}
                />
            ))}
        </div>
    );
};

export default CardCounters;
