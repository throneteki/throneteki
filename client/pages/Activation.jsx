import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import { navigate } from '../redux/reducers/navigation';
import { useActivateAccountMutation } from '../redux/middleware/api';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import { toast } from 'react-toastify';

const Activation = ({ id, token }) => {
    const dispatch = useDispatch();
    const [activateAccount, { isLoading }] = useActivateAccountMutation();

    useEffect(() => {
        const doActivate = async () => {
            try {
                await activateAccount({ id, token }).unwrap();
            } catch (err) {
                toast.error(err.message || 'An error occurred activating your account');

                return;
            }

            dispatch(navigate('/login'));

            toast.success(
                'Your account has been activated.  You will shortly be redirected to the login page.'
            );
        };

        doActivate();
    }, [activateAccount, dispatch, id, token]);

    if (!id || !token) {
        return (
            <AlertPanel
                variant='danger'
                message='This page is not intended to be viewed directly.  Please click on the link in your email to activate your account'
            />
        );
    }

    if (isLoading) {
        return <LoadingSpinner label='Activating your account...' />;
    }

    return (
        <div>
            <div className='mx-auto w-1/3'></div>
        </div>
    );
};

export default Activation;
