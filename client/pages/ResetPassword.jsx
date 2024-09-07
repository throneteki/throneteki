import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { navigate } from '../redux/reducers/navigation';
import { useResetPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from '@nextui-org/react';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);
    const [password, setPassword] = useState('');

    const onSubmit = useCallback(
        async (state) => {
            setErrorMessage();
            setSuccessMessage();

            try {
                await resetPassword({
                    id: id,
                    token: token,
                    newPassword: password
                }).unwrap();

                setSuccessMessage(
                    'Your password has been changed.  You will shortly be redirected to the login page.'
                );

                setTimeout(() => {
                    dispatch(navigate('/login'));
                });
            } catch (err) {
                setErrorMessage(err || 'An error occurred resetting your password');
            }
        },
        [dispatch, id, password, resetPassword, token]
    );

    if (!id || !token) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on the link in your email to reset your password'
            />
        );
    }

    return (
        <div>
            <div className='w-2/5 mx-auto'>
                {errorMessage && <AlertPanel variant='danger' message={errorMessage} />}
                {successMessage && <AlertPanel variant='success' message={successMessage} />}
                <Panel title='Reset password'>
                    <Input
                        name='password'
                        label='New password'
                        type='password'
                        onChange={setPassword}
                    />
                    <Button onClick={onSubmit} loading={isLoading}>
                        Submit
                    </Button>
                </Panel>
            </div>
        </div>
    );
};

export default ResetPassword;
