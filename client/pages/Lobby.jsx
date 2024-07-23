import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import News from '../Components/News/News';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Typeahead from '../Components/Form/Typeahead';
import SideBar from '../Components/Lobby/SideBar';
import UserList from '../Components/Lobby/UserList';
import LobbyChat from '../Components/Lobby/LobbyChat';
import { getMessageWithLinks } from '../util';

import * as actions from '../actions';
import { createSelector } from '@reduxjs/toolkit';
import { useGetNewsQuery } from '../redux/middleware/api';
import { sendLobbyChatMessage } from '../redux/reducers/lobby';

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

    const checkChatError = useCallback(() => {
        if (lobbyError) {
            toastr.error('New users are limited from chatting in the lobby, try again later');

            setTimeout(() => {
                dispatch(actions.clearChatStatus());
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

                messageRef.current.clear();

                event.preventDefault();
            }
        },
        [sendMessage]
    );

    const onSendClick = useCallback(
        (event) => {
            event.preventDefault();

            sendMessage();
        },
        [sendMessage]
    );

    const onChange = useCallback((value) => {
        setMessage(value);
    }, []);

    const onRemoveMessageClick = useCallback(
        (messageId) => {
            dispatch(actions.removeLobbyMessage(messageId));
        },
        [dispatch]
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
        <div className='flex-container'>
            <SideBar>
                <UserList users={users} />
            </SideBar>
            {motd && motd.message && (
                <div className='col-sm-offset-1 col-sm-10 banner'>
                    <AlertPanel type={motd.motdType}>
                        {getMessageWithLinks(motd.message)}
                    </AlertPanel>
                </div>
            )}
            {bannerNotice ? (
                <div className='col-sm-offset-1 col-sm-10 announcement'>
                    <AlertPanel message={bannerNotice} type='error' />
                </div>
            ) : null}
            <div className='col-sm-offset-1 col-sm-10'>
                <Panel title='Latest site news'>
                    {newsStatus}
                    {newsSuccess && <News news={news} />}
                </Panel>
            </div>
            <div className='col-sm-offset-1 col-sm-10 chat-container'>
                <Panel title={`Lobby Chat (${users.length} online)`}>
                    <div>
                        <LobbyChat
                            messages={messages}
                            isModerator={user && user.permissions.canModerateChat}
                            onRemoveMessageClick={onRemoveMessageClick}
                        />
                    </div>
                </Panel>
                <form className='form form-hozitontal chat-box-container' onSubmit={onSendClick}>
                    <div className='form-group'>
                        <div className='chat-box'>
                            <Typeahead
                                disabled={!isLoggedIn}
                                ref={messageRef}
                                value={message}
                                placeholder={placeholder}
                                labelKey={'name'}
                                onKeyDown={onKeyPress}
                                options={users}
                                onInputChange={onChange}
                                autoFocus
                                dropup
                                emptyLabel={''}
                                minLength={2}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Lobby;
