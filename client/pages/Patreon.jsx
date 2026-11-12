import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setUser } from '../redux/reducers/auth';
import { useLinkPatreonMutation } from '../redux/middleware/api';
import Page from './Page';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ErrorMessage from '../Components/Site/ErrorMessage';
import { PatreonStateKey } from '../util';
import { useOAuthCallback } from './useOAuthCallback';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const [linkPatreon] = useLinkPatreonMutation();

    const link = useCallback(
        async (oauthCode) => {
            const response = await linkPatreon(oauthCode).unwrap();
            if (response?.user) {
                dispatch(setUser(response.user));
            }
        },
        [dispatch, linkPatreon]
    );

    const { oauthCode, isLinking } = useOAuthCallback({
        code,
        stateKey: PatreonStateKey,
        link,
        redirectTo: '/profile',
        successMessage: 'Your account was linked successfully',
        notStartedMessage:
            'This Patreon link request was not started from your profile. Please try again.'
    });

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
            {isLinking && <LoadingSpinner label='Please wait while we verify your details...' />}
        </Page>
    );
};

export default Patreon;
