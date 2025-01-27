import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import { useLoginAccountMutation } from '../redux/middleware/api';
import { accountLoggedIn } from '../redux/reducers/auth';
import { navigate } from '../redux/reducers/navigation';
import { sendAuthenticateMessage } from '../redux/reducers/lobby';
import * as yup from 'yup';
import { Button, Input } from '@heroui/react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch();
    const [loginAccount, { isLoading }] = useLoginAccountMutation();

    const onLogin = useCallback(
        async (state) => {
            try {
                const response = await loginAccount({
                    username: state.username,
                    password: state.password
                }).unwrap();

                dispatch(accountLoggedIn(response.user, response.token, response.refreshToken));
                dispatch(sendAuthenticateMessage(response.token));

                toast.success('Logged in successfully');

                dispatch(navigate('/'));
            } catch (err) {
                toast.error(err || 'An error occured logging in. Please try again later.');
            }
        },
        [dispatch, loginAccount]
    );

    const schema = yup.object({
        username: yup.string().required('You must specify a username'),
        password: yup.string().required('You must specify a password')
    });

    return (
        <div className='md:mx-auto md:w-4/5 lg:w-2/5 mx-2'>
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
