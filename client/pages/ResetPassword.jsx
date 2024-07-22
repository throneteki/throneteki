import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import { navigate } from '../redux/reducers/navigation';
import { useResetPasswordMutation } from '../redux/middleware/api';

const ResetPassword = ({ id, token }) => {
    const dispatch = useDispatch();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);

    const onSubmit = useCallback(
        async (state) => {
            setErrorMessage();
            setSuccessMessage();

            try {
                await resetPassword({
                    id: id,
                    token: token,
                    newPassword: state.password
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
        [dispatch, id, resetPassword, token]
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
            <div className='col-sm-6 col-sm-offset-3'>
                {errorMessage && <AlertPanel type='error' message={errorMessage} />}
                {successMessage && <AlertPanel type='success' message={successMessage} />}
                <Panel title='Reset password'>
                    <Form
                        name='resetpassword'
                        apiLoading={isLoading}
                        buttonText='Submit'
                        onSubmit={onSubmit}
                    />
                </Panel>
            </div>
        </div>
    );
};

export default ResetPassword;
