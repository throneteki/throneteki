import React from 'react';
import classNames from 'classnames';
import Counter from './Counter';
import { useAdaptiveBoard } from './adaptiveContext';

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

// On the adaptive board counters are sized to the card, not the screen: one small badge for each kind, its letter and
// count ("J5" for five journey tokens), padded so the text stays inside
const looks = {
    classic: {
        container: 'gap-0.5 p-0.5',
        style: { '--counter-size': 'calc(var(--ui-scale, 1) * 1.5rem)' }
    },
    adaptive: {
        container: 'gap-px px-0.5',
        style: { '--counter-size': 'max(0.85rem, calc(var(--card-scale, 1) * 1rem))' },
        counter:
            '!w-auto min-w-[var(--counter-size)] px-[0.25em] !text-[calc(var(--counter-size)*0.6)] font-bold leading-none border border-black/50 shadow-[0_1px_2px_rgba(0,0,0,0.7)]'
    }
};

const CardCounters = ({ cardUuid, counters }) => {
    const look = looks[useAdaptiveBoard() ? 'adaptive' : 'classic'];
    if (counters.length === 0) {
        return null;
    }

    const keys = keysFor(counters);
    return (
        <div
            data-card-overlay=''
            className={classNames(
                'pointer-events-none absolute inset-0 z-[230] flex flex-wrap content-center items-center justify-center text-ink',
                look.container
            )}
            style={look.style}
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
                    className={look.counter}
                />
            ))}
        </div>
    );
};

export default CardCounters;
