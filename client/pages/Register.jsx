import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Link from '../Components/Site/Link';
import { navigate } from '../redux/reducers/navigation';
import { useRegisterAccountMutation } from '../redux/middleware/api';
import AlertPanel from '../Components/Site/AlertPanel';

const Register = () => {
    const dispatch = useDispatch();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [registerAccount, { isLoading }] = useRegisterAccountMutation();

    const onRegister = useCallback(
        async (state) => {
            try {
                setSuccessMessage();
                setErrorMessage();

                await registerAccount({
                    username: state.username,
                    password: state.password,
                    email: state.email,
                    enableGravatar: state.enableGravatar
                }).unwrap();

                setSuccessMessage(
                    'Your account was successfully registered.  Please verify your account using the link in the email sent to the address you have provided.'
                );

                setTimeout(() => {
                    dispatch(navigate('/'));
                }, 2000);
            } catch (err) {
                setErrorMessage(
                    err?.data?.message ||
                        'An error occurred registering your account. Please try again later.'
                );
            }
        },
        [dispatch, registerAccount]
    );

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {successMessage && <AlertPanel type='success' message={successMessage} />}
            {errorMessage && <AlertPanel type='error' message={errorMessage} />}
            <Panel title='Register an account'>
                <p>
                    We require information from you in order to service your access to the site.
                    Please see the <Link href='/privacy'>privacy policy</Link> for details on why we
                    need this information and what we do with it. Please pay particular attention to
                    the section on avatars.
                </p>

                <Form
                    name='register'
                    apiLoading={isLoading}
                    buttonClass='col-sm-offset-4 col-sm-3'
                    buttonText='Register'
                    onSubmit={onRegister}
                />
            </Panel>
        </div>
    );
};

export default Register;
