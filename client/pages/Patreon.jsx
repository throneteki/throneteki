import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import { navigate } from '../redux/reducers/navigation';
import { useLinkPatreonMutation } from '../redux/middleware/api';
import { toast } from 'react-toastify';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const [linkPatreon, { isLoading }] = useLinkPatreonMutation();

    useEffect(() => {
        if (!code) {
            return;
        }

        const doLink = async () => {
            try {
                await linkPatreon(code).unwrap();
            } catch (err) {
                toast.error(err.message || 'An error occurred linking your account');

                return;
            }

            dispatch(navigate('/profile'));

            toast.success(
                'Your account was linked successfully.  Sending you back to the profile page'
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

    return <div>{isLoading && <div>Please wait while we verify your details..</div>}</div>;
};

export default Patreon;
