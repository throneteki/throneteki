import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Link from '../Components/Site/Link';
import { useLoginAccountMutation } from '../redux/middleware/api';
import { accountLoggedIn } from '../redux/reducers/auth';
import { navigate } from '../redux/reducers/navigation';
import { sendAuthenticateMessage } from '../redux/reducers/lobby';

const Login = () => {
    const dispatch = useDispatch();
    const [loginAccount, { isLoading }] = useLoginAccountMutation();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const onLogin = useCallback(
        async (state) => {
            setError(undefined);
            setSuccess(undefined);
            try {
                const response = await loginAccount({
                    username: state.username,
                    password: state.password
                }).unwrap();

                dispatch(accountLoggedIn(response.user, response.token, response.refreshToken));
                dispatch(sendAuthenticateMessage(response.token));

                setSuccess('You have successfully logged in. Redirecting you to the home page...');

                setTimeout(() => {
                    dispatch(navigate('/'));
                }, 3000);
            } catch (err) {
                setError(err || 'An error occured logging in. Please try again later.');
            }
        },
        [dispatch, loginAccount]
    );

    const errorBar = error ? <AlertPanel type='error' message={error} /> : null;
    const successBar = success ? <AlertPanel type='success' message={success} /> : null;

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {errorBar}
            {successBar}
            <Panel title='Login'>
                <Form
                    name='login'
                    apiLoading={isLoading}
                    buttonClass='col-sm-offset-2 col-sm-3'
                    buttonText='Log In'
                    onSubmit={onLogin}
                >
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-10'>
                            <Link href='/forgot'>Forgot your password?</Link>
                        </div>
                    </div>
                </Form>
            </Panel>
        </div>
    );
};

export default Login;
