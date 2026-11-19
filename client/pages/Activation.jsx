import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Notice from '../Components/Site/Notice';
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
                toast.error(
                    err.data?.message || err.message || 'An error occurred activating your account'
                );

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
            <Notice kind='error' isBoxed className='mx-auto mt-10 max-w-xl'>
                This page only works from the link in your activation email. Please click that link
                to activate your account.
            </Notice>
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
