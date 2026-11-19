import React from 'react';
import classNames from 'classnames';

const kinds = {
    info: { icon: '', className: 'text-gold' },
    success: { icon: '', className: 'text-gold' },
    warning: { icon: '', className: 'text-warning' },
    error: { icon: '', className: 'text-danger' }
};

const Notice = ({ kind = 'info', title, isBoxed, className, children }) => {
    const { icon, className: iconClassName } = kinds[kind] || kinds.info;

    return (
        <div
            role={kind === 'error' ? 'alert' : 'status'}
            className={classNames(
                'flex items-center gap-3.5 text-sm text-ink-dim',
                isBoxed && 'border border-gold-line bg-frame px-4 py-3 sm:px-5',
                className
            )}
        >
            <span
                aria-hidden
                className={classNames(
                    'grid h-[34px] w-[34px] flex-none place-items-center rounded-full border border-gold-line font-icons text-[1.05rem] shadow-[inset_0_0_0_3px_#101216,inset_0_0_0_4px_rgba(201,164,92,0.16)]',
                    iconClassName
                )}
            >
                {icon}
            </span>
            <div className='min-w-0'>
                {title && <p className='font-medium text-ink'>{title}</p>}
                {children}
            </div>
        </div>
    );
};

export default Notice;
