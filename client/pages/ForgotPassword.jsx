import React, { useState, useCallback } from 'react';
import Field from '../Components/Site/Field';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Frame from '../Components/Site/Frame';
import Notice from '../Components/Site/Notice';

import { useForgotPasswordMutation } from '../redux/middleware/api';
import { Button, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';
import Page from './Page';

const ForgotPassword = () => {
    const [captcha, setCaptcha] = useState('');
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [username, setUsername] = useState('');

    const onCaptchaChange = useCallback((value) => {
        setCaptcha(value);
    }, []);

    const onSubmit = useCallback(async () => {
        try {
            await forgotPassword({ username, captcha }).unwrap();

            toast.success(
                'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
            );
        } catch (err) {
            toast.error(
                err.data?.message || err.message || 'An error occurred submitting your request'
            );
        }
    }, [forgotPassword, username, captcha]);
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    return (
        <Page size='narrow'>
            <Frame
                title='Forgot password'
                description="Enter your username. If it's registered, we'll email the address on the account with a link to reset your password."
            >
                <form
                    className='flex flex-col gap-4'
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <Field
                        label='Username'
                        name='username'
                        autoComplete='username'
                        value={username}
                        onValueChange={setUsername}
                        isDisabled={!siteKey}
                    />
                    {siteKey ? (
                        <HCaptcha sitekey={siteKey} onVerify={onCaptchaChange} />
                    ) : (
                        <Notice kind='error'>
                            The captcha couldn&apos;t load, so password resets aren&apos;t available
                            right now. Please try again later.
                        </Notice>
                    )}
                    <Button
                        className='w-full'
                        type='submit'
                        isPending={isLoading}
                        isDisabled={!username || !siteKey}
                        variant='primary'
                    >
                        {isLoading && <Spinner color='current' size='sm' />}Send reset link
                    </Button>
                </form>
            </Frame>
        </Page>
    );
};

export default ForgotPassword;
