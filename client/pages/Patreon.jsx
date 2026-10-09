import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { navigate } from '../redux/reducers/navigation';
import { setUser } from '../redux/reducers/auth';
import { useLinkPatreonMutation } from '../redux/middleware/api';
import { toast } from 'react-toastify';
import Page from './Page';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ErrorMessage from '../Components/Site/ErrorMessage';
import { PatreonStateKey } from '../util';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [linkPatreon, { isLoading }] = useLinkPatreonMutation();
    const searchParams = new URLSearchParams(window.location.search);
    const oauthCode = code || searchParams.get('code') || undefined;
    const oauthState = searchParams.get('state') || undefined;
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

        let expectedState;
        try {
            expectedState = window.sessionStorage.getItem(PatreonStateKey);
        } catch {
            expectedState = undefined;
        }

        // Only complete a link that this browser started, otherwise someone could link their
        // Patreon account to ours by getting us to open a callback url with their code
        if (!expectedState || expectedState !== oauthState) {
            toast.error(
                'This Patreon link request was not started from your profile. Please try again.'
            );
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
                window.sessionStorage.removeItem(PatreonStateKey);
            } catch (err) {
                void err;
            }

            toast.success('Your account was linked successfully');
            dispatch(navigate('/profile'));
        };

        doLink();
    }, [dispatch, linkPatreon, oauthCode, oauthState, token, user]);

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
