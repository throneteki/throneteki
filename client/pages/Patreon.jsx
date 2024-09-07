import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import { navigate } from '../redux/reducers/navigation';
import { useLinkPatreonMutation } from '../redux/middleware/api';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [linkPatreon, { isLoading }] = useLinkPatreonMutation();

    useEffect(() => {
        if (!code) {
            return;
        }

        const doLink = async () => {
            setSuccessMessage();
            setErrorMessage();
            try {
                await linkPatreon(code).unwrap();
            } catch (err) {
                setErrorMessage(err || 'An error occurred linking your account');

                return;
            }

            setTimeout(() => {
                dispatch(navigate('/profile'));
            }, 3000);

            setSuccessMessage(
                'Your account was linked successfully.  Sending you back to the profile page.'
            );
        };

        doLink();
    }, [code, dispatch, linkPatreon]);

    if (!code) {
        return (
            <AlertPanel
                variant='danger'
                message='This page is not intended to be viewed directly.  Please click on one of the links at the top of the page or your browser back button to return to the site.'
            />
        );
    }

    return (
        <div>
            {successMessage && <AlertPanel variant='success' message={successMessage} />}
            {errorMessage && <AlertPanel variant='danger' message={errorMessage} />}
            {isLoading && <div>Please wait while we verify your details..</div>}
        </div>
    );
};

export default Patreon;
