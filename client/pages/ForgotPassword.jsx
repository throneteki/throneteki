import React, { useState, useCallback } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';

import { useForgotPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from '@heroui/react';
import { toast } from 'react-toastify';
import Page from './Page';
import ErrorMessage from '../Components/Site/ErrorMessage';

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
            toast.error(err.message || 'An error occurred submitting your request');
        }
    }, [forgotPassword, username, captcha]);
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    return (
        <Page>
            <Panel title='Forgot password'>
                <div className='flex flex-col gap-2'>
                    <AlertPanel
                        variant='info'
                        message='Please enter your username and click the submit button to start the password recovery process.'
                    />
                    <Input
                        label={'Username'}
                        name='username'
                        value={username}
                        onValueChange={setUsername}
                        isDisabled={!siteKey}
                    />
                    {siteKey ? (
                        <HCaptcha sitekey={siteKey} onVerify={onCaptchaChange} />
                    ) : (
                        <ErrorMessage
                            title='Failed to load Captcha'
                            message='Invalid or missing site key'
                        />
                    )}
                    <Button
                        color='primary'
                        onPress={onSubmit}
                        loading={isLoading}
                        isDisabled={!username || !siteKey}
                    >
                        Submit
                    </Button>
                </div>
            </Panel>
        </Page>
    );
};

export default ForgotPassword;
