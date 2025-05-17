import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { navigate } from '../redux/reducers/navigation';
import { useResetPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from '@heroui/react';
import { toast } from 'react-toastify';

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
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly. Please click on the link in your email to reset your password.'
            />
        );
    }

    return (
        <div>
            <div className='w-2/5 mx-auto'>
                <Panel title='Reset password'>
                    <Input
                        name='password'
                        label='New password'
                        type='password'
                        onValueChange={setPassword}
                    />
                    <Button onPress={onSubmit} loading={isLoading}>
                        Submit
                    </Button>
                </Panel>
            </div>
        </div>
    );
};

export default ResetPassword;
