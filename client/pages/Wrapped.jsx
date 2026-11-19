import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@heroui/react';

import Notice from '../Components/Site/Notice';
import WrappedStory from '../Components/Wrapped/WrappedStory';
import { useGetWrappedQuery } from '../redux/middleware/api';
import { navigate } from '../redux/reducers/navigation';
import Page from './Page';

// Matches MinGames in WrappedService
const MinGames = 10;

// Not linked from any menu: players reach it from the White Book email
const Wrapped = ({ year }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { data, error, isLoading } = useGetWrappedQuery(year, { skip: !user });

    if (!user) {
        return (
            <Page size='small'>
                <div className='flex flex-col items-center gap-3 py-10 text-center'>
                    <p>Log in to see your {year} page in the White Book.</p>
                    <Button
                        onPress={() =>
                            dispatch(
                                navigate(
                                    '/login',
                                    `?return=${encodeURIComponent(`/white-book/${year}`)}`
                                )
                            )
                        }
                        variant='primary'
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
                <Notice isBoxed>
                    {error?.status === 404
                        ? `You have no page in the ${year} White Book. Players need at least ${MinGames} finished games in the year to get one.`
                        : error?.status === 410
                          ? `The ${year} White Book is no longer available.`
                          : 'Your page in the White Book could not be loaded.'}
                </Notice>
            </Page>
        );
    }

    return <WrappedStory username={user.username} wrapped={data.wrapped} />;
};

export default Wrapped;
