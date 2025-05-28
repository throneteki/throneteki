import React from 'react';
import ErrorMessage from '../Components/Site/ErrorMessage';

const Unauthorised = () => {
    return <ErrorMessage message='Sorry, you are not authorised to view that page.' />;
};

export default Unauthorised;
