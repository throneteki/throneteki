import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import { navigate } from '../redux/reducers/navigation';
import { useResetPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from '@heroui/react';
import { toast } from 'react-toastify';
import ErrorMessage from '../Components/Site/ErrorMessage';
import Page from './Page';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [password, setPassword] = useState('');

    const onSubmit = useCallback(async () => {
        try {
            await resetPassword({
                id: id,
                token: token,
                newPassword: password
            }).unwrap();

            toast.success(
                'Your password has been changed.  You will shortly be redirected to the login page'
            );

            dispatch(navigate('/login'));
        } catch (err) {
            toast.error(err.message || 'An error occurred resetting your password');
        }
    }, [dispatch, id, password, resetPassword, token]);

    if (!id || !token) {
        return (
            <Page className='h-full'>
                <ErrorMessage
                    title='This page is not intended to be viewed directly'
                    message='Please click on the link in your email to reset your password.'
                />
            </Page>
        );
    }

    return (
        <Page size='small'>
            <Panel title='Reset password'>
                <div className='flex flex-col gap-2'>
                    <p>
                        Please provide your new password, and click submit to finalise your reset.
                    </p>
                    <Input
                        name='password'
                        label='New password'
                        type='password'
                        onValueChange={setPassword}
                    />
                    <Button
                        className='sm:self-start'
                        onPress={onSubmit}
                        loading={isLoading}
                        color='primary'
                    >
                        Submit
                    </Button>
                </div>
            </Panel>
        </Page>
    );
};

export default ResetPassword;
