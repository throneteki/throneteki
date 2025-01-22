import React, { useState, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';

import { useForgotPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from "@heroui/react";
import { toast } from 'react-toastify';

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

    return (
        <div>
            <div className='md:mx-auto md:w-4/5 lg:w-2/5 mx-2'>
                <AlertPanel
                    variant='info'
                    message='To start the password recovery process, please enter your username and click the submit button.'
                />
                <div className='mt-2'>
                    <Panel title='Forgot password'>
                        <Input
                            label='Username'
                            name='username'
                            value={username}
                            onValueChange={setUsername}
                        />
                        <div className='mt-2 ml-1'>
                            <ReCAPTCHA
                                sitekey='6LfELhMUAAAAAKbD2kLd6OtbsBbrZJFs7grwOREZ'
                                theme='dark'
                                onChange={onCaptchaChange}
                            />
                        </div>
                        <div className='mt-2'>
                            <Button color='primary' onClick={onSubmit} loading={isLoading}>
                                Submit
                            </Button>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
