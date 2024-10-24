import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import { useLoginAccountMutation } from '../redux/middleware/api';
import { accountLoggedIn } from '../redux/reducers/auth';
import { navigate } from '../redux/reducers/navigation';
import { sendAuthenticateMessage } from '../redux/reducers/lobby';
import * as yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';

const Login = () => {
    const dispatch = useDispatch();
    const [loginAccount, { isLoading }] = useLoginAccountMutation();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const onLogin = useCallback(
        async (state) => {
            setError(undefined);
            setSuccess(undefined);
            try {
                const response = await loginAccount({
                    username: state.username,
                    password: state.password
                }).unwrap();

                dispatch(accountLoggedIn(response.user, response.token, response.refreshToken));
                dispatch(sendAuthenticateMessage(response.token));

                setSuccess('You have successfully logged in. Redirecting you to the home page...');

                setTimeout(() => {
                    dispatch(navigate('/'));
                }, 3000);
            } catch (err) {
                setError(err || 'An error occured logging in. Please try again later.');
            }
        },
        [dispatch, loginAccount]
    );

    const errorBar = error ? <AlertPanel variant='danger' message={error} /> : null;
    const successBar = success ? <AlertPanel variant='success' message={success} /> : null;

    const schema = yup.object({
        username: yup.string().required('You must specify a username'),
        password: yup.string().required('You must specify a password')
    });

    return (
        <div className='mx-auto w-2/5'>
            {errorBar}
            {successBar}
            <Panel className='mt-1' title='Login'>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={schema}
                    onSubmit={onLogin}
                >
                    {(formProps) => (
                        <form onSubmit={formProps.handleSubmit}>
                            <Input
                                label='Username'
                                {...formProps.getFieldProps('username')}
                                isInvalid={formProps.errors.username && formProps.touched.username}
                                errorMessage={formProps.errors.username}
                            />
                            <Input
                                className='mt-2'
                                label='Password'
                                type='password'
                                isInvalid={formProps.errors.password && formProps.touched.password}
                                errorMessage={formProps.errors.password}
                                {...formProps.getFieldProps('password')}
                            />
                            <Link href='/forgot'>Forgot your password?</Link>
                            <div className='mt-2'>
                                <Button isLoading={isLoading} type='submit' color='primary'>
                                    Login
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Panel>
        </div>
    );
};

export default Login;
