import React, { useState, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';

import { useForgotPasswordMutation } from '../redux/middleware/api';

const ForgotPassword = () => {
    const [captcha, setCaptcha] = useState('');
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const onCaptchaChange = useCallback((value) => {
        setCaptcha(value);
    }, []);

    const onSubmit = useCallback(
        async (state) => {
            try {
                setSuccessMessage();
                setErrorMessage();

                await forgotPassword({ username: state.username, captcha }).unwrap();

                setSuccessMessage(
                    'Your request was submitted.  If the username you entered is registered with the site, an email will be sent to the address registered on the account, detailing what to do next.'
                );
            } catch (err) {
                setErrorMessage(err || 'An error occurred submitting your request');
            }
        },
        [forgotPassword, captcha]
    );

    let errorBar = errorMessage && <AlertPanel type='error' message={errorMessage} />;
    let successBar = successMessage && <AlertPanel type='success' message={successMessage} />;

    if (successMessage) {
        return <div className='col-sm-6 col-sm-offset-3'>{successBar}</div>;
    }

    return (
        <div>
            <div className='col-sm-6 col-sm-offset-3'>
                {errorBar}
                <AlertPanel
                    type='info'
                    message='To start the password recovery process, please enter your username and click the submit button.'
                />
                <Panel title='Forgot password'>
                    <Form
                        name='forgotpassword'
                        buttonClass='col-sm-offset-2 col-sm-3'
                        buttonText='Submit'
                        onSubmit={onSubmit}
                        apiLoading={isLoading}
                    >
                        <div className='form-group'>
                            <div className='col-sm-offset-2 col-sm-3'>
                                <ReCAPTCHA
                                    sitekey='6LfELhMUAAAAAKbD2kLd6OtbsBbrZJFs7grwOREZ'
                                    theme='dark'
                                    onChange={onCaptchaChange}
                                />
                            </div>
                        </div>
                    </Form>
                </Panel>
            </div>
        </div>
    );
};

export default ForgotPassword;
