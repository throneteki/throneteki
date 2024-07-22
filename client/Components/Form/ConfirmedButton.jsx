import React, { useCallback, useState } from 'react';

const ConfirmedButton = ({ children, disabled, onClick }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInitialClick = useCallback((event) => {
        event.preventDefault();
        setShowConfirm(true);
    }, []);

    const handleConfirmClick = useCallback(
        (event) => {
            onClick(event);
            setShowConfirm(false);
        },
        [onClick]
    );

    return (
        <span>
            <button className='btn btn-primary' onClick={handleInitialClick} disabled={disabled}>
                {children}
            </button>
            {showConfirm && (
                <button className='btn btn-danger' onClick={handleConfirmClick}>
                    Confirm
                </button>
            )}
        </span>
    );
};

export default ConfirmedButton;
