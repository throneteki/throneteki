import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import News from '../Components/News/News';
import Frame from '../Components/Site/Frame';
import Notice from '../Components/Site/Notice';
import LobbyChat from '../Components/Lobby/LobbyChat';
import EventBanners from '../Components/Banners/EventBanners';
import { getMessageWithLinks } from '../util';

import { createSelector } from '@reduxjs/toolkit';
import { useGetNewsQuery } from '../redux/middleware/api';
import Page from './Page';
import { createMockLobbyMessages, createMockLobbyUsers, isMockMode } from '../dev/mockData';
import { Button, Link } from '@heroui/react';

const PatreonRelinkDismissKey = 'dismissedPatreonRelinkNotice';

const Lobby = () => {
    const { data: news, isError: newsError, isSuccess: newsSuccess } = useGetNewsQuery();

    const getLobbyState = (state) => state.lobby;

    // Define a memoized selector to get messages
    const getMessages = createSelector([getLobbyState], (lobby) => lobby.messages);
    const getUsers = createSelector([getLobbyState], (lobby) => lobby.users);
    const getBannerNotice = createSelector([getLobbyState], (lobby) => lobby.notice);

    const getLobbyError = createSelector([getLobbyState], (lobby) => lobby.lobbyError);
    const getMotd = createSelector([getLobbyState], (lobby) => lobby.motd);

    const lobbyMessages = useSelector(getMessages);
    const lobbyUsers = useSelector(getUsers);
    const [mock] = useState(() =>
        import.meta.env.DEV && isMockMode()
            ? { messages: createMockLobbyMessages(), users: createMockLobbyUsers() }
            : null
    );
    const messages = mock?.messages ?? lobbyMessages;
    const users = mock?.users ?? lobbyUsers;
    const { user } = useSelector((state) => state.auth);
    const bannerNotice = useSelector(getBannerNotice);
    const lobbyError = useSelector(getLobbyError);

    const motd = useSelector(getMotd);
    const [patreonNoticeDismissed, setPatreonNoticeDismissed] = useState(false);

    const patreonState = useMemo(() => {
        if (!user?.patreon) {
            return undefined;
        }

        if (typeof user.patreon === 'string') {
            return {
                status: user.patreon,
                connected: ['linked', 'pledged'].includes(user.patreon),
                needsRelink: false
            };
        }

        return user.patreon;
    }, [user]);

    useEffect(() => {
        if (!patreonState?.needsRelink) {
            setPatreonNoticeDismissed(false);
            try {
                window.sessionStorage.removeItem(PatreonRelinkDismissKey);
            } catch (err) {
                void err;
            }

            return;
        }

        try {
            setPatreonNoticeDismissed(
                window.sessionStorage.getItem(PatreonRelinkDismissKey) === 'true'
            );
        } catch (err) {
            void err;
        }
    }, [patreonState?.needsRelink]);

    const dismissPatreonNotice = () => {
        setPatreonNoticeDismissed(true);

        try {
            window.sessionStorage.setItem(PatreonRelinkDismissKey, 'true');
        } catch (err) {
            void err;
        }
    };

    let newsInfo = null;
    if (newsError) {
        newsInfo = (
            <Notice kind='error' isBoxed>
                The news couldn&apos;t be loaded.
            </Notice>
        );
    } else if (newsSuccess) {
        newsInfo = <News news={news} />;
    }

    const notices = [
        motd?.message && (
            <Notice key='motd' kind={motd.motdType} isBoxed>
                {getMessageWithLinks(motd.message)}
            </Notice>
        ),
        bannerNotice && (
            <Notice key='banner' kind='error' isBoxed>
                {bannerNotice}
            </Notice>
        ),
        patreonState?.needsRelink && !patreonNoticeDismissed && (
            <div
                key='patreon'
                className='flex flex-wrap items-center gap-x-4 gap-y-2 border border-gold-line bg-frame px-4 py-3 sm:px-5'
            >
                <Notice kind='warning' className='min-w-0 flex-1'>
                    {patreonState.message ||
                        'Your Patreon link has expired. Please relink your account.'}{' '}
                    <Link href='/profile/integrations'>Open your profile</Link>
                </Notice>
                <Button size='sm' onPress={dismissPatreonNotice} variant='tertiary'>
                    Dismiss
                </Button>
            </div>
        )
    ].filter(Boolean);

    return (
        <Page size='wide' className='max-w-[1040px] lg:h-full'>
            {notices.length > 0 && <div className='flex flex-col gap-3'>{notices}</div>}
            <EventBanners />
            {newsInfo}
            <Frame
                title='Lobby'
                description={
                    users.length === 1 ? '1 person online' : `${users.length} people online`
                }
                className='h-[75dvh] min-h-[26rem] lg:h-auto lg:min-h-[24rem] lg:flex-1'
                bodyClassName='min-h-0'
            >
                <LobbyChat
                    isLoggedIn={!!user}
                    username={user?.username}
                    messages={messages}
                    isModerator={user && user.permissions.canModerateChat}
                    lobbyError={lobbyError}
                />
            </Frame>
        </Page>
    );
};

export default Lobby;
