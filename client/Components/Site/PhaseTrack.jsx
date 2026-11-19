import React from 'react';
import { ActionWindows } from '../../constants';

const phases = [];
for (const window of ActionWindows) {
    const phase = phases.find((p) => p.label === window.phase);
    if (phase) {
        phase.windows.push(window.name);
    } else {
        phases.push({ label: window.phase, windows: [window.name] });
    }
}

const windowLabels = Object.fromEntries(ActionWindows.map((w) => [w.name, w.label]));

const PhaseTrack = ({ idPrefix = 'window', value, onChange, isDisabled }) => (
    <div className='phase-track'>
        {phases.map((phase) => {
            const single = phase.windows.length === 1;

            return (
                <div
                    key={phase.label}
                    className='grid grid-cols-[6.5rem_minmax(0,1fr)] content-start items-start gap-x-3 gap-y-2 border-t border-gold-hair py-2.5 last:border-b min-[821px]:grid-cols-1 min-[821px]:justify-items-center min-[821px]:gap-2.5 min-[821px]:border-0 min-[821px]:py-0 min-[821px]:text-center min-[821px]:last:border-b-0'
                >
                    <h4 className='font-display text-sm font-semibold text-ink-dim min-[821px]:h-[22px]'>
                        {phase.label}
                    </h4>
                    <div className='grid gap-2.5 min-[821px]:justify-items-center min-[821px]:gap-3'>
                        {phase.windows.map((name) => (
                            <label
                                key={name}
                                className='flex cursor-pointer items-center gap-3 text-sm text-ink-faint has-[:checked]:text-ink has-[:disabled]:cursor-default has-[:disabled]:opacity-60 min-[821px]:max-w-[7.5rem] min-[821px]:flex-col min-[821px]:gap-1.5 min-[821px]:text-xs'
                            >
                                <input
                                    id={`${idPrefix}-${name}`}
                                    type='checkbox'
                                    className='phase-node'
                                    aria-label={single ? windowLabels[name] : undefined}
                                    checked={!!value[name]}
                                    disabled={isDisabled}
                                    onChange={(event) => onChange(name, event.target.checked)}
                                />
                                {!single && <span>{windowLabels[name]}</span>}
                            </label>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);

export default PhaseTrack;
