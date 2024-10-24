import React from 'react';
import { Spinner } from '@nextui-org/react';

interface LoadingSpinnerProps {
    text: string;
}

function LoadingSpinner({ text }: LoadingSpinnerProps) {
    return (
        <div className='align-items-center justify-content-center flex flex-col'>
            <Spinner title={`${text}`} />
            <div>{text}</div>
        </div>
    );
}

export default LoadingSpinner;
