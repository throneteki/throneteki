import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import { navigate } from '../redux/reducers/navigation';
import { useRegisterAccountMutation } from '../redux/middleware/api';
import { Formik } from 'formik';
import { Button, Input, Switch } from "@heroui/react";
import { toast } from 'react-toastify';

const Register = () => {
    const dispatch = useDispatch();

    const [registerAccount, { isLoading }] = useRegisterAccountMutation();

    const onRegister = useCallback(
        async (state) => {
            try {
                await registerAccount({
                    username: state.username,
                    password: state.password,
                    email: state.email,
                    enableGravatar: state.enableGravatar
                }).unwrap();

                toast.error(
                    'Your account was successfully registered.  Please verify your account using the link in the email sent to the address you have provided'
                );

                dispatch(navigate('/'));
            } catch (err) {
                toast.error(
                    err.message ||
                        'An error occurred registering your account. Please try again later.'
                );
            }
        },
        [dispatch, registerAccount]
    );

    const schema = yup.object({
        username: yup
            .string()
            .required('You must specify a username')
            .min(3, 'Your username must be at least 3 characters long')
            .max(15, 'Your username cannot be more than 15 charcters')
            .matches(
                /^[A-Za-z0-9_-]+$/,
                'Usernames must only use the characters a-z, 0-9, _ and -'
            ),
        email: yup
            .string()
            .email('Please enter a valid email address')
            .required('You must specify an email address'),
        password: yup.string().min(6, 'Password must be at least 6 characters'),
        passwordAgain: yup
            .string()
            .oneOf([yup.ref('password'), null], 'The passwords you have entered do not match')
    });

    return (
        <div className='md:mx-auto md:w-4/5 lg:w-2/5 mx-2'>
            <Panel title='Register an account'>
                <p>
                    We require information from you in order to service your access to the site.
                    Please see the <Link href='/privacy'>privacy policy</Link> for details on why we
                    need this information and what we do with it. Please pay particular attention to
                    the section on avatars.
                </p>

                <div className='mt-2'>
                    <Formik initialValues={{}} validationSchema={schema} onSubmit={onRegister}>
                        {(formProps) => (
                            <form onSubmit={formProps.handleSubmit}>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                                    <Input
                                        label='Username'
                                        {...formProps.getFieldProps('username')}
                                        isInvalid={
                                            formProps.errors.username && formProps.touched.username
                                        }
                                        errorMessage={formProps.errors.username}
                                    />
                                    <Input
                                        label='Email Address'
                                        {...formProps.getFieldProps('email')}
                                        isInvalid={
                                            formProps.errors.email && formProps.touched.email
                                        }
                                        errorMessage={formProps.errors.email}
                                    />
                                    <Input
                                        label='Password'
                                        type='password'
                                        isInvalid={
                                            formProps.errors.password && formProps.touched.password
                                        }
                                        errorMessage={formProps.errors.password}
                                        {...formProps.getFieldProps('password')}
                                    />
                                    <Input
                                        label='Password (again)'
                                        type='password'
                                        isInvalid={
                                            formProps.errors.passwordAgain &&
                                            formProps.touched.passwordAgain
                                        }
                                        errorMessage={formProps.errors.passwordAgain}
                                        {...formProps.getFieldProps('passwordAgain')}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <Switch
                                        {...formProps.getFieldProps('enableGravatar')}
                                        onValueChange={(value) =>
                                            formProps.setFieldValue('enableGravatar', value)
                                        }
                                    >
                                        Enable Gravatar
                                    </Switch>
                                </div>
                                <div className='mt-2'>
                                    <Button isLoading={isLoading} type='submit' color='primary'>
                                        Register
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </Panel>
        </div>
    );
};

export default Register;
