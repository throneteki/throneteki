import React from 'react';
import { Spinner } from '@heroui/react';

function LoadingSpinner({ label = 'Loading...', color = 'white', ...props }) {
    return (
        <div className='flex justify-center items-center h-full'>
            <Spinner {...props} label={label} color={color} />
        </div>
    );
}

export default LoadingSpinner;
