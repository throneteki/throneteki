import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Unauthorised = () => {
    return (
        <div className='w-full h-full text-center p-5'>
            <FontAwesomeIcon size='xl' icon={faTriangleExclamation} />
            <div>Sorry, you are not authorised to view that page.</div>
        </div>
    );
};

export default Unauthorised;
