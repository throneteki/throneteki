import React from 'react';
import Frame from './Frame';
import Notice from './Notice';

const ErrorMessage = ({ title = 'Something went wrong', message }) => (
    <div className='mx-auto w-full max-w-[440px] px-2 py-4 sm:px-4 sm:py-6'>
        <Frame title={title}>
            <Notice kind='error'>{message}</Notice>
        </Frame>
    </div>
);

export default ErrorMessage;
