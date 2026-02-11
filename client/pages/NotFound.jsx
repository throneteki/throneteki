import React from 'react';
import Page from './Page';
import ErrorMessage from '../Components/Site/ErrorMessage';

const NotFound = () => {
    return (
        <Page className='h-full'>
            <ErrorMessage message="Sorry, the page you were looking for couldn't be found." />
        </Page>
    );
};

export default NotFound;
