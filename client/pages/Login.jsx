import React, { useCallback } from 'react';
import Field from '../Components/Site/Field';
import { useDispatch } from 'react-redux';

import Frame from '../Components/Site/Frame';
import { useLoginAccountMutation } from '../redux/middleware/api';
import { accountLoggedIn } from '../redux/reducers/auth';
import { navigate } from '../redux/reducers/navigation';
import { sendAuthenticateMessage } from '../redux/reducers/lobby';
import * as yup from 'yup';
import { Button, Spinner } from '@heroui/react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import NavigationLink from '../Components/Site/NavigationLink';
import Page from './Page';

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

                // Only return to a page on this site, so a crafted link can't send people elsewhere
                const returnTo = new URLSearchParams(window.location.search).get('return');
                dispatch(navigate(/^\/(?![/\\])/.test(returnTo || '') ? returnTo : '/'));
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
        <Page size='narrow'>
            <Frame title='Login'>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={schema}
                    onSubmit={onLogin}
                >
                    {(formProps) => (
                        <form onSubmit={formProps.handleSubmit} className='flex flex-col gap-4'>
                            <Field
                                label='Username'
                                autoComplete='username'
                                {...formProps.getFieldProps('username')}
                                isInvalid={formProps.errors.username && formProps.touched.username}
                                errorMessage={formProps.errors.username}
                            />
                            <div className='flex flex-col gap-1.5'>
                                <Field
                                    label='Password'
                                    type='password'
                                    autoComplete='current-password'
                                    isInvalid={
                                        formProps.errors.password && formProps.touched.password
                                    }
                                    errorMessage={formProps.errors.password}
                                    {...formProps.getFieldProps('password')}
                                />
                                <NavigationLink className='self-end text-sm' href='/forgot'>
                                    Forgot your password?
                                </NavigationLink>
                            </div>
                            <Button
                                className='w-full'
                                isPending={isLoading}
                                type='submit'
                                variant='primary'
                            >
                                {isLoading && <Spinner color='current' size='sm' />}Login
                            </Button>
                            <p className='border-t border-gold-hair pt-4 text-center text-sm text-ink-dim'>
                                New to the site?{' '}
                                <NavigationLink href='/register'>
                                    Register an account
                                </NavigationLink>
                            </p>
                        </form>
                    )}
                </Formik>
            </Frame>
        </Page>
    );
};

export default Login;
