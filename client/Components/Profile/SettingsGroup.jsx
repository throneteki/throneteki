import React from 'react';
import classNames from 'classnames';

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
