import React from 'react';
import classNames from 'classnames';

// A choice drawn as a bordered tile, for radio groups in settings
export const tileClassNames = {
    base: 'm-0 inline-flex w-full max-w-full cursor-pointer items-center gap-2 rounded-medium border-2 border-default-200 p-2 hover:bg-default-100/50 data-[selected=true]:border-primary',
    labelWrapper: 'ms-0 min-w-0 flex-1'
};

const SettingsGroup = ({ title, description, className, children }) => (
    <section className='flex flex-col gap-2'>
        <div>
            <h2 className='text-medium font-bold'>{title}</h2>
            {description && <p className='text-small text-default-500'>{description}</p>}
        </div>
        <div
            className={classNames(
                'rounded-medium border border-default-200 bg-black/30',
                className || 'flex flex-col divide-y divide-default-100'
            )}
        >
            {children}
        </div>
    </section>
);

export default SettingsGroup;
