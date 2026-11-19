import React from 'react';
import Notice from './Notice';

const ApiStatus = ({ apiState, successMessage }) => {
    if (!apiState || apiState.loading) {
        return null;
    }

    let error;
    if (typeof apiState.message === 'object') {
        error = (
            <ul>
                {Object.values(apiState.message).map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        );
    } else {
        error = apiState.message;
    }

    return (
        <div className='flex flex-col gap-3'>
            {apiState.success || <Notice kind='error'>{error}</Notice>}
            {successMessage && <Notice kind='success'>{successMessage}</Notice>}
        </div>
    );
};

export default ApiStatus;
