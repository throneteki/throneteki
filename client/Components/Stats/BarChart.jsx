import React, { useState } from 'react';

const BarChart = ({ title, bars, describe, summary }) => {
    const [active, setActive] = useState(null);
    const max = Math.max(1, ...bars.map((bar) => bar.value));
    const activeBar = bars.find((bar) => bar.key === active);

    return (
        <figure className='m-0 flex min-w-0 flex-col gap-1'>
            <figcaption className='flex flex-wrap items-baseline justify-between gap-x-3 leading-5'>
                <span className='font-semibold'>{title}</span>
                <span className='text-sm tabular-nums text-default-500'>
                    {activeBar ? describe(activeBar) : summary}
                </span>
            </figcaption>
            <div
                className='flex h-28 items-end gap-[2px] border-b border-default-300/60'
                onMouseLeave={() => setActive(null)}
            >
                {bars.map((bar) => (
                    <button
                        key={bar.key}
                        type='button'
                        aria-label={describe(bar)}
                        className='group flex h-full min-w-0 flex-1 cursor-default items-end focus:outline-none'
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(bar.key)}
                        onFocus={() => setActive(bar.key)}
                        onMouseEnter={() => setActive(bar.key)}
                    >
                        <span
                            className={`block w-full rounded-t bg-secondary transition-opacity ${
                                active && active !== bar.key ? 'opacity-40' : ''
                            } group-focus-visible:ring-2 group-focus-visible:ring-white/40`}
                            style={{
                                height: bar.value > 0 ? `max(2px, ${(100 * bar.value) / max}%)` : 0
                            }}
                        />
                    </button>
                ))}
            </div>
            <div className='flex gap-[2px] text-xs leading-3 text-default-500'>
                {bars.map((bar) => (
                    <span
                        key={bar.key}
                        className='min-w-0 flex-1 overflow-visible whitespace-nowrap text-center'
                    >
                        {bar.axisLabel ? bar.label : ''}
                    </span>
                ))}
            </div>
        </figure>
    );
};

export default BarChart;
