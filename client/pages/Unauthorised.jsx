import React from 'react';
import ErrorMessage from '../Components/Site/ErrorMessage';

const Unauthorised = () => (
    <ErrorMessage
        title='Not authorised'
        message='Sorry, you are not authorised to view that page.'
    />
);

export default Unauthorised;
