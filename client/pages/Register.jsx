import React, { useCallback, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Panel from '../Components/Site/Panel';
import { navigate } from '../redux/reducers/navigation';
import { usePreflightRegisterMutation, useRegisterAccountMutation } from '../redux/middleware/api';
import { Formik } from 'formik';
import { Button, Input, Link, Switch } from '@heroui/react';
import { toast } from 'react-toastify';
import NavigationLink from '../Components/Site/NavigationLink';
import Page from './Page';
import ErrorMessage from '../Components/Site/ErrorMessage';

const Register = () => {
    const dispatch = useDispatch();
    const [challengeRequired, setChallengeRequired] = useState(false);
    const [captcha, setCaptcha] = useState('');

    const [preflightRegister] = usePreflightRegisterMutation();
    const [registerAccount, { isLoading }] = useRegisterAccountMutation();
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

    const onRegister = useCallback(
        async (state) => {
            try {
                const fingerprint = {
                    platform: window.navigator?.platform,
                    timezone: window.Intl?.DateTimeFormat().resolvedOptions().timeZone,
                    language: window.navigator?.language
                };
                const preflight = await preflightRegister({
                    username: state.username,
                    email: state.email,
                    captcha,
                    fingerprint,
                    platform: fingerprint.platform,
                    timezone: fingerprint.timezone
                }).unwrap();

                setChallengeRequired(!!preflight.challengeRequired);

                if (preflight.challengeRequired && !captcha) {
                    if (!siteKey) {
                        toast.error(
                            'Captcha verification is required for this registration, but it is not available right now.'
                        );
                    } else {
                        toast.error('Please complete the captcha before registering.');
                    }
                    return;
                }

                if (!preflight.canProceed) {
                    toast.error(
                        preflight.cooldownRemainingMs
                            ? 'Too many recent registration attempts. Please try again later.'
                            : 'This registration needs manual review. Please contact support.'
                    );
                    return;
                }

                const response = await registerAccount({
                    username: state.username,
                    password: state.password,
                    email: state.email,
                    enableGravatar: state.enableGravatar,
                    captcha,
                    fingerprint,
                    platform: fingerprint.platform,
                    timezone: fingerprint.timezone
                }).unwrap();

                const needsReview = response.trustState === 'restricted';
                const requiresVerification = response.requiresVerification ?? true;

                toast.success(
                    needsReview
                        ? 'Your account was registered with limited permissions while it is reviewed.'
                        : requiresVerification
                          ? 'Your account was successfully registered. Please verify it using the link sent to your email address.'
                          : 'Your account was successfully registered.'
                );

                dispatch(navigate('/'));
            } catch (err) {
                toast.error(
                    err?.data?.message ||
                        err?.message ||
                        err?.error ||
                        'An error occurred registering your account. Please try again later.'
                );
            }
        },
        [captcha, dispatch, preflightRegister, registerAccount, siteKey]
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
        <Page size='small'>
            <Panel title='Register an account'>
                <p>
                    We require information from you in order to service your access to the site.
                    Please see the{' '}
                    <Link href='/privacy' as={NavigationLink} size='sm'>
                        privacy policy
                    </Link>{' '}
                    for details on why we need this information and what we do with it. Please pay
                    particular attention to the section on avatars.
                </p>

                <div className='mt-2'>
                    <Formik initialValues={{}} validationSchema={schema} onSubmit={onRegister}>
                        {(formProps) => (
                            <form onSubmit={formProps.handleSubmit} className='flex flex-col gap-2'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
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
                                <p className='text-sm'>
                                    This website uses{' '}
                                    <Link href='https://gravatar.com/' size='sm'>
                                        Gravatar
                                    </Link>{' '}
                                    to update user avatars, and can be enabled/disabled in settings
                                    at any time. For this to work, please ensure you enable below,
                                    and your Gravatar email matches the above.
                                </p>
                                <Switch
                                    {...formProps.getFieldProps('enableGravatar')}
                                    onValueChange={(value) =>
                                        formProps.setFieldValue('enableGravatar', value)
                                    }
                                >
                                    Enable Gravatar
                                </Switch>
                                {challengeRequired ? (
                                    siteKey ? (
                                        <HCaptcha sitekey={siteKey} onVerify={setCaptcha} />
                                    ) : (
                                        <ErrorMessage
                                            title='Failed to load Captcha'
                                            message='Captcha is required for this registration but the site key is missing.'
                                        />
                                    )
                                ) : null}
                                <Button
                                    className='sm:self-start'
                                    isLoading={isLoading}
                                    type='submit'
                                    color='primary'
                                >
                                    Register
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </Panel>
        </Page>
    );
};

export default Register;
