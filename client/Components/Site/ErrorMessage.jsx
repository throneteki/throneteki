import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

// details: what went wrong, shown in development builds so an error on a phone can be read off the screen
const ErrorMessage = ({ includeIcon = true, title, message, color = 'white', details }) => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='text-center'>
                {includeIcon && (
                    <FontAwesomeIcon icon={faExclamationTriangle} size='5x' color={color} />
                )}
                {title && <h1 className='text-large'>{title}</h1>}
                {message && <p>{message}</p>}
                {details && (
                    <pre className='mx-auto mt-3 max-h-[60vh] max-w-[95vw] select-text overflow-auto whitespace-pre-wrap break-words rounded bg-black/80 p-2 text-left text-[11px] leading-snug text-danger-300'>
                        {details}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
