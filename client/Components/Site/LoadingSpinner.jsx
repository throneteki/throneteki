import React from 'react';
import { Spinner } from '@nextui-org/react';

function LoadingSpinner({ label = 'Loading...', color = 'white', ...props }) {
    return (
        <div className='flex justify-center items-center'>
            <Spinner {...props} label={label} color={color} />
        </div>
    );
}

export default LoadingSpinner;
