import React from 'react';
import Frame from './Frame';
import Notice from './Notice';

// details: what went wrong, shown in development builds so an error on a phone can be read off the screen
const ErrorMessage = ({ title = 'Something went wrong', message, details }) => (
    <div className='mx-auto w-full max-w-[440px] px-2 py-4 sm:px-4 sm:py-6'>
        <Frame title={title}>
            <Notice kind='error'>{message}</Notice>
            {details && (
                <pre className='max-h-[60vh] select-text overflow-auto whitespace-pre-wrap break-words rounded bg-well p-2 text-left text-xs text-danger'>
                    {details}
                </pre>
            )}
        </Frame>
    </div>
);

export default ErrorMessage;
