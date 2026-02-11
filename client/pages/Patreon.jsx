import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { navigate } from '../redux/reducers/navigation';
import { useLinkPatreonMutation } from '../redux/middleware/api';
import { toast } from 'react-toastify';
import Page from './Page';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ErrorMessage from '../Components/Site/ErrorMessage';

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
                'Your account was linked successfully. Sending you back to the profile page'
            );
        };

        doLink();
    }, [code, dispatch, linkPatreon]);

    if (!code) {
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
