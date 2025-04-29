import classNames from 'classnames';
import React from 'react';

const Page = ({ className, children }) => {
    const wrapperClassName = classNames(
        'p-1 md:p-2 lg:mx-auto lg:w-4/5 flex flex-col gap-1 md:gap-2',
        className
    );
    return <div className={wrapperClassName}>{children}</div>;
};

export default Page;
