import React from 'react';

const StatTile = ({ label, value, detail }) => {
    return (
        <div className='flex min-w-0 flex-col gap-1 rounded-md border border-default-200/50 bg-black/40 px-3 py-2'>
            <span className='text-sm leading-4 text-default-500'>{label}</span>
            <span className='truncate text-2xl font-semibold leading-8 tabular-nums'>{value}</span>
            {detail && (
                <span className='truncate text-sm leading-4 text-default-500'>{detail}</span>
            )}
        </div>
    );
};

export default StatTile;
