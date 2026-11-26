import React from 'react';
import ErrorMessage from '../Components/Site/ErrorMessage';

const NotFound = () => (
    <ErrorMessage
        title='Page not found'
        message="Sorry, the page you were looking for couldn't be found."
    />
);

export default NotFound;
