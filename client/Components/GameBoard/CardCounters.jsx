import React from 'react';
import classNames from 'classnames';
import Counter from './Counter';

const CardCounters = ({ counters }) => {
    if (counters.length === 0) {
        return null;
    }

    let countersClass = classNames('counters', 'ignore-mouse-events', {
        'many-counters': counters.length > 3
    });

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

    return <div className={countersClass}>{counterDivs}</div>;
};

export default CardCounters;
