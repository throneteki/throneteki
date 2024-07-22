import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import { navigate } from '../redux/reducers/navigation';
import { useActivateAccountMutation } from '../redux/middleware/api';

const Activation = ({ id, token }) => {
    const dispatch = useDispatch();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [activateAccount, { isLoading }] = useActivateAccountMutation();

    useEffect(() => {
        const doActivate = async () => {
            setSuccessMessage();
            setErrorMessage();
            try {
                await activateAccount({ id, token }).unwrap();
            } catch (err) {
                setErrorMessage(err || 'An error occurred activating your account');
            }

            setTimeout(() => {
                dispatch(navigate('/login'));
            }, 3000);

            setSuccessMessage(
                'Your account has been activated.  You will shortly be redirected to the login page.'
            );
        };

        doActivate();
    }, [activateAccount, dispatch, id, token]);

    if (!id || !token) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on the link in your email to activate your account'
            />
        );
    }

    if (isLoading) {
        return <span>Activating your account, please wait...</span>;
    }

    return (
        <div>
            <div className='col-sm-6 col-sm-offset-3'>
                {errorMessage && <AlertPanel type='error' message={errorMessage} />}
                {successMessage && <AlertPanel type='success' message={successMessage} />}
            </div>
        </div>
    );
};

export default Activation;
