import React from 'react';
import classNames from 'classnames';

const Group = ({ title, description, className, children }) => (
    <section className='flex flex-col'>
        <h3 className='font-display text-lg font-semibold text-gold'>{title}</h3>
        {description && <p className='mt-0.5 max-w-prose text-sm text-ink-faint'>{description}</p>}
        <div className={classNames('mt-2.5', className)}>{children}</div>
    </section>
);

export default Group;
