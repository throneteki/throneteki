import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { motionOff } from '../../../flip';
import { remSize } from '../../../cardScale';

export const phases = [
    { name: 'plot', label: 'Plot' },
    { name: 'draw', label: 'Draw' },
    { name: 'marshal', label: 'Marshaling' },
    { name: 'challenge', label: 'Challenges' },
    { name: 'dominance', label: 'Dominance' },
    { name: 'standing', label: 'Standing' },
    { name: 'taxation', label: 'Taxation' }
];
const setup = { name: 'setup', label: 'Setup' };
// Either side of the current phase, the names shown; one more each way is drawn invisible, so a name rolling in
// or out fades rather than appearing or vanishing
const reach = 3;
const gapRem = 0.75;
const rollTime = 450;

const mod = (value, by) => ((value % by) + by) % by;

// Where the game is in its run of phases, counted from setup (0), then 1 for the first plot phase and on through the
// rounds. The server does not say which round it is, so rounds are counted here as the phases wrap around; joined
// part way through a game, the count starts wherever it is, and setup never shows again.
const usePosition = (phase) => {
    const state = useRef({ phase: null, round: 0, sawSetup: false });
    const now = state.current;
    if (phase !== now.phase) {
        const index = phases.findIndex((entry) => entry.name === phase);
        const before = phases.findIndex((entry) => entry.name === now.phase);
        if (phase === 'setup') {
            now.sawSetup = true;
            now.round = 0;
        } else if (index >= 0 && before >= 0 && index < before) {
            now.round += 1;
        }
        now.phase = phase;
    }
    if (phase === 'setup') {
        return { position: 0, sawSetup: true };
    }
    const index = phases.findIndex((entry) => entry.name === phase);
    if (index < 0) {
        return null;
    }
    return { position: 1 + now.round * phases.length + index, sawSetup: now.sawSetup };
};

const entryAt = (position, sawSetup) =>
    sawSetup && position === 0 ? setup : phases[mod(position - 1, phases.length)];

// The round's phases as one line of full names that rolls along as the game moves on: the current phase in the
// middle and lit, those gone by rolling off to the left and those to come rolling in from the right, the line
// fading out at its edges. It only ever holds one of each phase (setup only before the first round), so it never
// repeats a name however wide it is, and keeps only the names near the current one.
const PhaseRoll = ({ phase, className }) => {
    const at = usePosition(phase);
    const measureRef = useRef(null);
    const [widths, setWidths] = useState(null);

    // Every name's width, measured once from a hidden copy, and again if the text changes size
    useLayoutEffect(() => {
        const row = measureRef.current;
        if (!row) {
            return;
        }
        const measure = () => {
            const next = {};
            for (const child of row.children) {
                next[child.dataset.name] = child.offsetWidth;
            }
            setWidths((current) =>
                current && Object.keys(next).every((key) => current[key] === next[key])
                    ? current
                    : next
            );
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(row);
        return () => observer.disconnect();
    }, []);

    const rem = remSize();
    const gap = gapRem * rem;
    const shown = [];
    if (at && widths) {
        const first = at.sawSetup ? Math.max(0, at.position - reach - 1) : at.position - reach - 1;
        const items = [];
        for (let position = first; position <= at.position + reach + 1; position++) {
            items.push({ position, entry: entryAt(position, at.sawSetup) });
        }
        // Each name's centre, measured from the current one's
        const current = items.findIndex((item) => item.position === at.position);
        const centre = new Array(items.length).fill(0);
        for (let index = current + 1; index < items.length; index++) {
            centre[index] =
                centre[index - 1] +
                widths[items[index - 1].entry.name] / 2 +
                gap +
                widths[items[index].entry.name] / 2;
        }
        for (let index = current - 1; index >= 0; index--) {
            centre[index] =
                centre[index + 1] -
                widths[items[index + 1].entry.name] / 2 -
                gap -
                widths[items[index].entry.name] / 2;
        }
        items.forEach((item, index) => shown.push({ ...item, x: centre[index] }));
    }

    return (
        <div
            className={classNames(
                'relative h-[1.2em] overflow-hidden text-[11px] font-semibold uppercase leading-[1.2em] tracking-wider',
                '[mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]',
                className
            )}
        >
            <div
                ref={measureRef}
                aria-hidden
                className='pointer-events-none invisible absolute left-0 top-0 flex whitespace-nowrap'
            >
                {[setup, ...phases].map((entry) => (
                    <span key={entry.name} data-name={entry.name}>
                        {entry.label}
                    </span>
                ))}
            </div>
            {shown.map(({ position, entry, x }) => {
                const distance = position - at.position;
                return (
                    <span
                        key={position}
                        className={classNames('absolute left-1/2 top-0 whitespace-nowrap', {
                            'text-warning': distance === 0,
                            'text-ink-faint/50': distance < 0,
                            'text-ink-faint': distance > 0
                        })}
                        style={{
                            translate: `calc(${x}px - 50%) 0`,
                            opacity: Math.abs(distance) > reach ? 0 : 1,
                            transition: motionOff()
                                ? 'none'
                                : `translate ${rollTime}ms ease-in-out, opacity ${rollTime}ms ease-in-out, color ${rollTime}ms`
                        }}
                    >
                        {entry.label}
                    </span>
                );
            })}
        </div>
    );
};

export default PhaseRoll;
