import classNames from 'classnames';
import React, { forwardRef } from 'react';

const Page = forwardRef(function Page({ className, children, size = 'normal' }, ref) {
    const wrapperClassName = classNames(
        'mx-auto flex w-full flex-col gap-6 px-2 py-4 sm:px-4 sm:py-6',
        {
            'md:w-3/5 lg:w-2/5': size === 'small',
            'max-w-[440px]': size === 'narrow',
            'max-w-[940px]': size === 'normal'
        },
        className
    );
    return (
        <div className={wrapperClassName} ref={ref}>
            {children}
        </div>
    );
});

export default Page;
