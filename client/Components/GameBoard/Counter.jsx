import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import ThronesIcon from './ThronesIcon';
import { motionOff } from '../../flip';
import { firstSight, hold, release, remember } from '../../counterMemory';

import './Counter.css';

const countUpStep = 130;

const pop = (el) =>
    el.animate([{ scale: 1 }, { scale: 1.35, offset: 0.35 }, { scale: 1 }], {
        duration: 300,
        easing: 'ease-out'
    });

const floatChange = (el, change) => {
    const delta = document.createElement('span');
    delta.textContent = change > 0 ? `+${change}` : `${change}`;
    delta.className = `counter-delta ${change > 0 ? 'text-green-300' : 'text-red-300'}`;
    el.append(delta);
    const float = delta.animate(
        [
            { opacity: 0, translate: '-50% 0' },
            { opacity: 1, translate: '-50% -60%', offset: 0.2 },
            { opacity: 0, translate: '-50% -160%' }
        ],
        { duration: 900, easing: 'ease-out' }
    );
    float.onfinish = float.oncancel = () => delta.remove();
};

// A counter pops whenever its value changes, and how much it changed by floats up off it. A counter placed on
// a card pops as it appears, with nothing floating up; tokens placed several at once count up one at a time.
const useCounterMotion = (id, value, countsUp) => {
    const ref = useRef(null);
    const [start] = useState(() => firstSight(id, value, countsUp));
    const [shown, setShown] = useState(() => (motionOff() ? value : start.shown));
    const previous = useRef(start.previous);
    const placing = useRef(!!start.placed);

    useEffect(() => {
        hold(id);
        return () => release(id);
    }, [id]);

    useLayoutEffect(() => {
        const before = previous.current;
        const placed = placing.current;
        placing.current = false;
        previous.current = value;
        remember(id, value);
        const el = ref.current;

        if (!el || motionOff()) {
            setShown(value);
            return;
        }

        if (placed) {
            pop(el);
            if (typeof value !== 'number' || start.shown >= value) {
                return;
            }
            let count = start.shown;
            const timer = setInterval(() => {
                count += 1;
                setShown(count);
                pop(el);
                if (count >= value) {
                    clearInterval(timer);
                }
            }, countUpStep);
            return () => clearInterval(timer);
        }

        setShown(value);
        if (before === value) {
            return;
        }
        pop(el);
        const change = Number(value) - Number(before);
        if (typeof value === 'number' && Number.isFinite(change) && change !== 0) {
            floatChange(el, change);
        }
    }, [id, value, start]);

    return { ref, shown };
};

// The colour each kind of counter is drawn in
const counterColours = (name) => ({
    'bg-success-100/85': name === 'dupe',
    'bg-red-800/85': name === 'strength' || name === 'blood',
    'bg-blue-900/85': name === 'card-power',
    'bg-gray-500/85': name === 'stand',
    'bg-yellow-900/85': name === 'poison',
    'bg-yellow-400/85': name === 'gold',
    'bg-gray-300/85': name === 'valarmorghulis',
    'bg-orange-800/85': name === 'betrayal' || name === 'journey',
    'bg-purple-800/85': name === 'vengeance' || name === 'shadow',
    'bg-lime-400/85': name === 'ear',
    'bg-purple-600/85': name === 'kiss',
    'bg-yellow-700/85': name === 'bell',
    'bg-white/85 text-black': name === 'prayer' || name === 'ghost',
    'bg-gray-400/85': name === 'tale',
    'bg-teal-600/85': name === 'venom',
    'bg-black/85': name === 'challenge-icon' || name === 'faction'
});

const Counter = ({ id, name, cancel, fade, icon, shortName, value, className, countsUp }) => {
    const { ref, shown } = useCounterMotion(id, icon ? cancel : value, countsUp);
    const getClassName = useCallback(() => {
        return classNames(
            'relative p-0 card-text w-[var(--counter-size)] h-[var(--counter-size)] flex justify-center items-center rounded-md',
            `${name}-token`,
            counterColours(name),
            {
                'cancel relative': cancel,
                'fade-out': fade
            },
            className
        );
    }, [name, cancel, fade, className]);

    const counterClassName = getClassName();

    if (icon) {
        return (
            <div ref={ref} className={counterClassName}>
                <ThronesIcon icon={icon} noSize />
            </div>
        );
    }

    return (
        <div ref={ref} key={name} className={counterClassName}>
            {shortName}
            {shown}
        </div>
    );
};

export default Counter;
