import React from 'react';
import classNames from 'classnames';

const Tag = ({ tone, className, children }) => (
    <span
        className={classNames(
            'inline-flex items-center border px-1.5 py-px text-xs',
            tone === 'warning'
                ? 'border-warning/40 text-warning'
                : tone === 'danger'
                  ? 'border-danger/40 text-danger'
                  : 'border-gold-hair text-ink-faint',
            className
        )}
    >
        {children}
    </span>
);

export default Tag;
