import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { getMessageWithLinks } from '../util';

import { createSelector } from '@reduxjs/toolkit';
import { useGetNewsQuery, useRemoveMessageMutation } from '../redux/middleware/api';
import { clearChatStatus, sendLobbyChatMessage } from '../redux/reducers/lobby';
import { Input } from '@nextui-org/react';
import { toast } from 'react-toastify';

const Lobby = () => {
    const [message, setMessage] = useState('');
    const {
        data: news,
        isLoading: newsLoading,
        isError: newsError,
        isSuccess: newsSuccess
    } = useGetNewsQuery();
    const messageRef = useRef();

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

    const onKeyPress = useCallback(
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
    let newsStatus = null;
    if (newsLoading) {
        newsStatus = <div>News loading...</div>;
    } else if (newsError) {
        newsStatus = <div>Site news failed to load.</div>;
    }

    return (
        <div className='mx-auto flex h-[91vh] w-2/3 flex-col'>
            <div></div>
            {motd && motd.message && (
                <AlertPanel variant={motd.motdType}>{getMessageWithLinks(motd.message)}</AlertPanel>
            )}
            {bannerNotice ? <AlertPanel message={bannerNotice} variant='danger' /> : null}
            <div>
                <Panel title='Latest site news' className='mt-2'>
                    {newsStatus}
                    {newsSuccess && <News news={news} />}
                </Panel>
            </div>
            <Panel className='mt-4' title={`Lobby Chat (${users.length} online)`}>
                <LobbyChat
                    messages={messages}
                    isModerator={user && user.permissions.canModerateChat}
                    onRemoveMessageClick={onRemoveMessageClick}
                />
            </Panel>
            <form
                className='relative bottom-[42px] left-[2px] z-50 pr-[5px]'
                onSubmit={(event) => {
                    event.preventDefault();
                    sendMessage();
                }}
            >
                <Input
                    ref={messageRef}
                    classNames={{ inputWrapper: 'rounded-tl-none rounded-tr-none' }}
                    onKeyDown={onKeyPress}
                    onChange={(event) =>
                        setMessage(
                            event.target.value.substring(
                                0,
                                Math.min(512, event.target.value.length)
                            )
                        )
                    }
                    placeholder={placeholder}
                    value={message}
                ></Input>
            </form>
        </div>
    );
};

export default Lobby;
