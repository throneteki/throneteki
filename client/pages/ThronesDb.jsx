import React, { useCallback } from 'react';

import { useLinkThronesDbMutation } from '../redux/middleware/api';
import Page from './Page';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ErrorMessage from '../Components/Site/ErrorMessage';
import { ThronesDbStateKey } from '../util';
import { useOAuthCallback } from './useOAuthCallback';

const ThronesDb = () => {
    const [linkThronesDb] = useLinkThronesDbMutation();

    const link = useCallback((oauthCode) => linkThronesDb(oauthCode).unwrap(), [linkThronesDb]);

    const { oauthCode } = useOAuthCallback({
        stateKey: ThronesDbStateKey,
        link,
        redirectTo: '/decks/thronesdb',
        successMessage: 'Your ThronesDB account was linked successfully',
        notStartedMessage: 'This ThronesDB link request was not started here. Please try again.'
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
            <LoadingSpinner label='Linking your ThronesDB account...' />
        </Page>
    );
};

export default ThronesDb;
