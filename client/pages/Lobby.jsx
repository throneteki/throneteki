import React from 'react';
import { useSelector } from 'react-redux';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { getMessageWithLinks } from '../util';

import { createSelector } from '@reduxjs/toolkit';
import { useGetNewsQuery } from '../redux/middleware/api';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Page from './Page';

const Lobby = () => {
    const {
        data: news,
        isLoading: newsLoading,
        isError: newsError,
        isSuccess: newsSuccess
    } = useGetNewsQuery();

    const getLobbyState = (state) => state.lobby;

    // Define a memoized selector to get messages
    const getMessages = createSelector([getLobbyState], (lobby) => lobby.messages);
    const getUsers = createSelector([getLobbyState], (lobby) => lobby.users);
    const getBannerNotice = createSelector([getLobbyState], (lobby) => lobby.notice);

    const getLobbyError = createSelector([getLobbyState], (lobby) => lobby.lobbyError);
    const getMotd = createSelector([getLobbyState], (lobby) => lobby.motd);

    const messages = useSelector(getMessages);
    const users = useSelector(getUsers);
    const { user } = useSelector((state) => state.auth);
    const bannerNotice = useSelector(getBannerNotice);
    const lobbyError = useSelector(getLobbyError);

    const motd = useSelector(getMotd);

    let newsInfo = null;
    if (newsLoading) {
        newsInfo = <LoadingSpinner />;
    } else if (newsError) {
        newsInfo = <AlertPanel variant='danger'>Site news failed to load</AlertPanel>;
    } else if (newsSuccess) {
        newsInfo = <News news={news} />;
    }

    return (
        <Page className='h-full'>
            {motd && motd.message && (
                <AlertPanel variant={motd.motdType}>{getMessageWithLinks(motd.message)}</AlertPanel>
            )}
            {bannerNotice ? <AlertPanel message={bannerNotice} variant='danger' /> : null}
            <Panel className='max-h-[20vh]' title='Latest site news'>
                {newsInfo}
            </Panel>
            <Panel
                className='flex-grow overflow-y-auto min-h-64'
                title={`Lobby Chat (${users.length} online)`}
            >
                <LobbyChat
                    isLoggedIn={!!user}
                    messages={messages}
                    isModerator={user && user.permissions.canModerateChat}
                    lobbyError={lobbyError}
                />
            </Panel>
        </Page>
    );
};

export default Lobby;
