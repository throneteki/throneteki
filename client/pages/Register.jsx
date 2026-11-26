import React, { useCallback, useState } from 'react';
import Field from '../Components/Site/Field';
import SettingSwitch from '../Components/Site/SettingSwitch';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import Frame from '../Components/Site/Frame';
import Notice from '../Components/Site/Notice';
import { navigate } from '../redux/reducers/navigation';
import { usePreflightRegisterMutation, useRegisterAccountMutation } from '../redux/middleware/api';
import { Formik } from 'formik';
import { Button, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';
import NavigationLink from '../Components/Site/NavigationLink';
import Page from './Page';

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
        <Page size='narrow'>
            <Frame
                title='Register an account'
                description={
                    <>
                        The <NavigationLink href='/privacy'>privacy policy</NavigationLink> explains
                        what we keep about you and why, including how avatars work.
                    </>
                }
            >
                <Formik
                    initialValues={{ enableGravatar: false }}
                    validationSchema={schema}
                    onSubmit={onRegister}
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
                            <Field
                                label='Email address'
                                type='email'
                                autoComplete='email'
                                {...formProps.getFieldProps('email')}
                                isInvalid={formProps.errors.email && formProps.touched.email}
                                errorMessage={formProps.errors.email}
                            />
                            <Field
                                label='Password'
                                type='password'
                                autoComplete='new-password'
                                {...formProps.getFieldProps('password')}
                                isInvalid={formProps.errors.password && formProps.touched.password}
                                errorMessage={formProps.errors.password}
                            />
                            <Field
                                label='Password (again)'
                                type='password'
                                autoComplete='new-password'
                                {...formProps.getFieldProps('passwordAgain')}
                                isInvalid={
                                    formProps.errors.passwordAgain &&
                                    formProps.touched.passwordAgain
                                }
                                errorMessage={formProps.errors.passwordAgain}
                            />
                            <div>
                                <SettingSwitch
                                    label='Use my Gravatar'
                                    hint={
                                        <>
                                            Show the picture from{' '}
                                            <a href='https://gravatar.com/'>Gravatar</a> for the
                                            email above. You can change this in your profile.
                                        </>
                                    }
                                    isSelected={formProps.values.enableGravatar}
                                    onValueChange={(value) =>
                                        formProps.setFieldValue('enableGravatar', value)
                                    }
                                />
                            </div>
                            {challengeRequired &&
                                (siteKey ? (
                                    <HCaptcha sitekey={siteKey} onVerify={setCaptcha} />
                                ) : (
                                    <Notice kind='error'>
                                        This registration needs a captcha, but the captcha
                                        couldn&apos;t load. Please try again later.
                                    </Notice>
                                ))}
                            <Button
                                className='w-full'
                                isPending={isLoading}
                                type='submit'
                                variant='primary'
                            >
                                {isLoading && <Spinner color='current' size='sm' />}Register
                            </Button>
                            <p className='border-t border-gold-hair pt-4 text-center text-sm text-ink-dim'>
                                Already registered?{' '}
                                <NavigationLink href='/login'>Login</NavigationLink>
                            </p>
                        </form>
                    )}
                </Formik>
            </Frame>
        </Page>
    );
};

export default Register;
