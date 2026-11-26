import React from 'react';
import classNames from 'classnames';

const Group = ({ title, description, badge, className, children }) => (
    <section className='flex flex-col'>
        <div className='flex items-start justify-between gap-2'>
            <h3 className='min-w-0 font-display text-lg font-semibold text-gold'>{title}</h3>
            {badge}
        </div>
        {description && <p className='mt-0.5 max-w-prose text-sm text-ink-faint'>{description}</p>}
        <div className={classNames('mt-2.5', className)}>{children}</div>
    </section>
);

export default Group;
