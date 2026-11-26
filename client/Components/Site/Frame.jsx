import React, { forwardRef } from 'react';
import classNames from 'classnames';

const Frame = forwardRef(function Frame(
    { title, description, actions, footer, className, bodyClassName, children },
    ref
) {
    const hasHeader = title || description || actions;

    return (
        <section
            ref={ref}
            className={classNames(
                'frame relative flex flex-col bg-frame shadow-[0_18px_40px_rgba(0,0,0,0.55)]',
                className
            )}
        >
            {hasHeader && (
                <header className='flex flex-wrap items-start gap-x-6 gap-y-3 px-[22px] pt-[26px] sm:px-8'>
                    <div className='min-w-[min(100%,18rem)] flex-1'>
                        {title && (
                            <h2 className='text-balance font-display text-2xl font-semibold text-ink'>
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className='mt-1 max-w-prose text-sm text-ink-dim'>{description}</p>
                        )}
                    </div>
                    {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
                </header>
            )}
            <div
                className={classNames(
                    'flex min-h-0 flex-1 flex-col px-[22px] pb-[26px] sm:px-8',
                    hasHeader ? 'pt-[22px]' : 'pt-[26px]',
                    bodyClassName ?? 'gap-[30px]'
                )}
            >
                {children}
            </div>
            {footer && (
                <div className='sticky bottom-[7px] z-10 mx-2.5 border-t border-gold-line bg-[#0c0d11] px-3 pb-[11px] pt-3 sm:mx-3.5 sm:px-[18px] sm:pb-[13px] sm:pt-3.5'>
                    {footer}
                </div>
            )}
        </section>
    );
});

export default Frame;
