import React from 'react';
import Counter from './Counter';
import { useAdaptiveBoard } from './adaptiveContext';

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

// On the adaptive board counters are sized to the card, not the screen, and laid along its bottom edge: one small
// badge for each kind, its letter and count ("J5" for five journey tokens), padded so the text stays inside
const compactStyle = { '--counter-size': 'max(0.85rem, calc(var(--card-scale, 1) * 1rem))' };
const compactClass =
    '!w-auto min-w-[var(--counter-size)] px-[0.25em] !text-[calc(var(--counter-size)*0.6)] font-bold leading-none border border-black/50 shadow-[0_1px_2px_rgba(0,0,0,0.7)]';

const CompactCounters = ({ cardUuid, counters }) => {
    const keys = keysFor(counters);
    return (
        <div
            data-card-overlay=''
            className='absolute inset-x-0 bottom-[6%] z-[230] flex flex-wrap items-end justify-center gap-px px-0.5 text-white pointer-events-none'
            style={compactStyle}
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
                    className={compactClass}
                />
            ))}
        </div>
    );
};

const CardCounters = ({ cardUuid, counters }) => {
    const adaptive = useAdaptiveBoard();
    if (counters.length === 0) {
        return null;
    }
    if (adaptive) {
        return <CompactCounters cardUuid={cardUuid} counters={counters} />;
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
