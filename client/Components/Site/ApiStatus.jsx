import React from 'react';
import AlertPanel from './AlertPanel';

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
        <div>
            {apiState.success || (
                <AlertPanel type='error' multiLine>
                    {error}
                </AlertPanel>
            )}
            {successMessage && <AlertPanel type='success' message={successMessage} />}
        </div>
    );
};

export default ApiStatus;
