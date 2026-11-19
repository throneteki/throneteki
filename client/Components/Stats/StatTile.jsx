import React from 'react';

const StatTile = ({ label, value, detail }) => {
    return (
        <div className='flex min-w-0 flex-col gap-1 border border-gold-hair bg-white/[0.02] px-3 py-2.5'>
            <span className='text-sm leading-4 text-ink-dim'>{label}</span>
            <span className='truncate text-xl font-semibold leading-7 tabular-nums'>{value}</span>
            {detail && <span className='truncate text-sm leading-4 text-ink-dim'>{detail}</span>}
        </div>
    );
};

export default StatTile;
