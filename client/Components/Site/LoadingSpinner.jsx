import React from 'react';
import { Spinner } from '@heroui/react';
import classNames from 'classnames';

function LoadingSpinner({ label = 'Loading...', className, size }) {
    return (
        <div
            role='status'
            className={classNames(
                className,
                'flex h-full flex-col items-center justify-center gap-2 text-sm text-ink-dim'
            )}
        >
            <Spinner color='current' size={size} />
            {label && <span>{label}</span>}
        </div>
    );
}

export default LoadingSpinner;
