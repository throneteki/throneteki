import React from 'react';
import { Spinner } from '@nextui-org/react';
import classNames from 'classnames';

function LoadingSpinner({ label = 'Loading...', color = 'white', className, ...props }) {
    return (
        <div className={classNames(className, 'flex justify-center items-center')}>
            <Spinner {...props} label={label} color={color} />
        </div>
    );
}

export default LoadingSpinner;
