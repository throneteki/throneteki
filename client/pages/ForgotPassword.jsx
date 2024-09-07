import React, { useState, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';

import { useForgotPasswordMutation } from '../redux/middleware/api';
import { Button, Input } from '@nextui-org/react';

const ForgotPassword = () => {
    const [captcha, setCaptcha] = useState('');
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [username, setUsername] = useState('');

    const onCaptchaChange = useCallback((value) => {
        setCaptcha(value);
    }, []);

    const onSubmit = useCallback(async () => {
        try {
            setSuccessMessage();
            setErrorMessage();

            await forgotPassword({ username, captcha }).unwrap();

            setSuccessMessage(
                'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
            );
        } catch (err) {
            setErrorMessage(err || 'An error occurred submitting your request');
        }
    }, [forgotPassword, username, captcha]);

    let errorBar = errorMessage && (
        <div className='mb-2'>
            <AlertPanel variant='danger' message={errorMessage} />
        </div>
    );
    let successBar = successMessage && (
        <div className='mb-2'>
            <AlertPanel variant='success' message={successMessage} />
        </div>
    );

    if (successMessage) {
        return <div className='mx-auto w-2/5'>{successBar}</div>;
    }

    return (
        <div>
            <div className='mx-auto w-2/5'>
                <AlertPanel
                    variant='info'
                    message='To start the password recovery process, please enter your username and click the submit button.'
                />
                <div className='mt-2'>
                    <Panel title='Forgot password'>
                        {errorBar}

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
