import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@heroui/react';

import AlertPanel from '../Components/Site/AlertPanel';
import WrappedStory from '../Components/Wrapped/WrappedStory';
import { useGetWrappedQuery } from '../redux/middleware/api';
import { navigate } from '../redux/reducers/navigation';
import Page from './Page';

// Matches MinGames in WrappedService
const MinGames = 10;

// Not linked from any menu: players reach it from the Wrapped email
const Wrapped = ({ year }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { data, error, isLoading } = useGetWrappedQuery(year, { skip: !user });

    if (!user) {
        return (
            <Page size='small'>
                <div className='flex flex-col items-center gap-3 py-10 text-center'>
                    <p>Log in to see your {year} Wrapped.</p>
                    <Button
                        color='primary'
                        onPress={() =>
                            dispatch(
                                navigate(
                                    '/login',
                                    `?return=${encodeURIComponent(`/wrapped/${year}`)}`
                                )
                            )
                        }
                    >
                        Log in
                    </Button>
                </div>
            </Page>
        );
    }

    if (isLoading) {
        return <p className='py-10 text-center'>Loading...</p>;
    }

    if (error || !data?.wrapped) {
        return (
            <Page size='small'>
                <AlertPanel
                    variant='info'
                    message={
                        error?.status === 404
                            ? `There's no ${year} Wrapped for you. Players need at least ${MinGames} finished games in the year to get one.`
                            : error?.status === 410
                              ? `Your ${year} Wrapped is no longer available.`
                              : 'Your Wrapped could not be loaded.'
                    }
                />
            </Page>
        );
    }

    return <WrappedStory username={user.username} wrapped={data.wrapped} />;
};

export default Wrapped;
