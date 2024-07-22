import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useLogoutAccountMutation } from '../redux/middleware/api';
import AlertPanel from '../Components/Site/AlertPanel';
import { startConnecting } from '../redux/reducers/lobby';
import { accountLoggedOut } from '../redux/reducers/auth';
import { navigate } from '../redux/reducers/navigation';

const Logout = () => {
    const [logout, { isLoading }] = useLogoutAccountMutation();
    const refreshToken = useSelector((state) => state.auth.refreshToken);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        async function doLogout() {
            try {
                await logout(refreshToken.id).unwrap();
            } catch (err) {
                setError(err || 'An error occurred logging you out. Please try again later.');

                return;
            }

            dispatch(accountLoggedOut());

            dispatch(startConnecting());

            setSuccess('You were successfully logged out, redirecting you shortly.');
            setTimeout(() => {
                dispatch(navigate('/'));
            }, 3000);
        }

        if (!refreshToken) {
            return;
        }

        doLogout();
    }, [dispatch, logout, refreshToken]);

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {success && <AlertPanel type='success' message={success} />}
            {error && <AlertPanel type='error' message={error} />}

            {isLoading && <span>Logging you out of your account, please wait...</span>}
        </div>
    );
};

export default Logout;
