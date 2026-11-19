import React, { useState, useCallback } from 'react';
import Field from '../Components/Site/Field';
import { useDispatch } from 'react-redux';

import Frame from '../Components/Site/Frame';
import { navigate } from '../redux/reducers/navigation';
import { useResetPasswordMutation } from '../redux/middleware/api';
import { Button, Spinner } from '@heroui/react';
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
            toast.error(
                err.data?.message || err.message || 'An error occurred resetting your password'
            );
        }
    }, [dispatch, id, password, resetPassword, token]);

    if (!id || !token) {
        return (
            <ErrorMessage
                title='Link not valid'
                message='Use the link in your password reset email to open this page.'
            />
        );
    }

    return (
        <Page size='narrow'>
            <Frame title='Reset password' description='Choose a new password for your account.'>
                <form
                    className='flex flex-col gap-4'
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <Field
                        name='password'
                        label='New password'
                        type='password'
                        autoComplete='new-password'
                        onValueChange={setPassword}
                    />
                    <Button
                        className='w-full'
                        type='submit'
                        isPending={isLoading}
                        isDisabled={!password}
                        variant='primary'
                    >
                        {isLoading && <Spinner color='current' size='sm' />}Set password
                    </Button>
                </form>
            </Frame>
        </Page>
    );
};

export default ResetPassword;
