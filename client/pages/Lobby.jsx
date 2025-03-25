import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { getMessageWithLinks } from '../util';

import { createSelector } from '@reduxjs/toolkit';
import { useGetNewsQuery, useRemoveMessageMutation } from '../redux/middleware/api';
import { clearChatStatus, sendLobbyChatMessage } from '../redux/reducers/lobby';
import { Textarea } from '@heroui/react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../Components/Site/LoadingSpinner';

const Lobby = () => {
    const [message, setMessage] = useState('');
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

    const dispatch = useDispatch();

    const [removeMessage] = useRemoveMessageMutation();

    const checkChatError = useCallback(() => {
        if (lobbyError) {
            toast.error('New users are limited from chatting in the lobby, try again later');

            setTimeout(() => {
                dispatch(clearChatStatus());
            }, 5000);
        }
    }, [lobbyError, dispatch]);

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        dispatch(sendLobbyChatMessage(message));

        setMessage('');
    }, [dispatch, message]);

    const onKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage();
                event.preventDefault();
            }
        },
        [sendMessage]
    );

    const onRemoveMessageClick = useCallback(
        async (messageId) => {
            try {
                await removeMessage(messageId).unwrap();
            } catch (err) {
                console.info(err);
            }
        },
        [removeMessage]
    );

    useEffect(() => {
        checkChatError();
    }, [checkChatError, dispatch]);

    useEffect(() => {
        checkChatError();
    }, [checkChatError, lobbyError]);

    let isLoggedIn = !!user;
    let placeholder = isLoggedIn
        ? 'Enter a message...'
        : 'You must be logged in to send lobby chat messages';
    let newsInfo = null;
    if (newsLoading) {
        newsInfo = <LoadingSpinner />;
    } else if (newsError) {
        newsInfo = <AlertPanel variant='danger'>Site news failed to load</AlertPanel>;
    } else if (newsSuccess) {
        newsInfo = <News news={news} />;
    }

    return (
        <div className='m-2 lg:mx-auto lg:w-4/5 flex flex-col gap-2 h-full'>
            {motd && motd.message && (
                <AlertPanel variant={motd.motdType}>{getMessageWithLinks(motd.message)}</AlertPanel>
            )}
            {bannerNotice ? <AlertPanel message={bannerNotice} variant='danger' /> : null}
            <div className='max-h-[25vh]'>
                <Panel title='Latest site news'>{newsInfo}</Panel>
            </div>
            <Panel className='flex flex-col' title={`Lobby Chat (${users.length} online)`}>
                <LobbyChat
                    messages={messages}
                    isModerator={user && user.permissions.canModerateChat}
                    onRemoveMessageClick={onRemoveMessageClick}
                />
                <Textarea
                    classNames={{ inputWrapper: 'rounded-tl-none rounded-tr-none' }}
                    onKeyDown={onKeyDown}
                    onValueChange={setMessage}
                    maxLength={512}
                    placeholder={placeholder}
                    value={message}
                    minRows={1}
                ></Textarea>
            </Panel>
        </div>
    );
};

export default Lobby;
