import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { navigate } from '../redux/reducers/navigation';
import { setUser } from '../redux/reducers/auth';
import { useLinkPatreonMutation } from '../redux/middleware/api';
import { toast } from 'react-toastify';
import Page from './Page';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ErrorMessage from '../Components/Site/ErrorMessage';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [linkPatreon, { isLoading }] = useLinkPatreonMutation();
    const oauthCode = code || new URLSearchParams(window.location.search).get('code') || undefined;
    const hasLinkedRef = useRef(false);

    useEffect(() => {
        if (!oauthCode || !token || hasLinkedRef.current) {
            return;
        }

        let completedCode;
        try {
            completedCode = window.sessionStorage.getItem('patreonLinkedCode');
        } catch {
            completedCode = undefined;
        }

        if (completedCode === oauthCode) {
            dispatch(navigate('/profile'));
            return;
        }

        hasLinkedRef.current = true;

        const doLink = async () => {
            try {
                let response = await linkPatreon(oauthCode).unwrap();
                if (response?.user) {
                    dispatch(setUser(response.user));
                }
            } catch (err) {
                hasLinkedRef.current = false;
                toast.error(err.message || 'An error occurred linking your account');

                return;
            }

            try {
                window.sessionStorage.setItem('patreonLinkedCode', oauthCode);
            } catch (err) {
                void err;
            }

            toast.success('Your account was linked successfully');
            dispatch(navigate('/profile'));
        };

        doLink();
    }, [dispatch, linkPatreon, oauthCode, token, user]);

    if (!oauthCode) {
        return (
            <Page className='h-full'>
                <ErrorMessage
                    title='This page is not intended to be viewed directly'
                    message='Please click on one of the links at the top of the page or your browser back button to return to the site.'
                />
            </Page>
        );
    }
    return (
        <Page className='h-full'>
            {isLoading && <LoadingSpinner label='Please wait while we verify your details...' />}
        </Page>
    );
};

export default Patreon;
