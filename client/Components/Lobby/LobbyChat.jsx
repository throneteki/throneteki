import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
import $ from 'jquery';

import Avatar from '../Site/Avatar';

const LobbyChat = ({ messages, isModerator, onRemoveMessageClick }) => {
    const [canScroll, setCanScroll] = useState(true);
    const messagesEndRef = useRef(null);

    const onScroll = useCallback(() => {
        let messages = messagesEndRef.current;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (canScroll) {
            $(messagesEndRef.current).scrollTop(999999);
        }
    }, [messages, canScroll]);

    const handleRemoveMessageClick = useCallback(
        (messageId, event) => {
            event.preventDefault();

            if (onRemoveMessageClick) {
                onRemoveMessageClick(messageId);
            }
        },
        [onRemoveMessageClick]
    );

    const getMessages = useCallback(() => {
        const groupedMessages = {};
        let index = 0;
        const today = moment();
        const yesterday = moment().add(-1, 'days');
        let lastUser;
        let currentGroup = 0;
        for (let message of messages) {
            if (!message.user) {
                return undefined;
            }
            const formattedTime = moment(message.time).format('YYYYMMDDHHmm');
            if (lastUser && message.user && lastUser !== message.user.username) {
                currentGroup++;
            }
            const key = message.user.username + formattedTime + currentGroup;
            if (!groupedMessages[key]) {
                groupedMessages[key] = [];
            }
            groupedMessages[key].push(message);
            lastUser = message.user.username;
        }
        return Object.values(groupedMessages).map((messages) => {
            let timestamp;
            const firstMessage = messages[0];
            if (!firstMessage.user) {
                return undefined;
            }
            if (today.isSame(firstMessage.time, 'd')) {
                timestamp = moment(firstMessage.time).format('H:mm');
            } else if (yesterday.isSame(firstMessage.time, 'd')) {
                timestamp = 'yesterday ' + moment(firstMessage.time).format('H:mm');
            } else {
                timestamp = moment(firstMessage.time).format('MMM Do H:mm');
            }
            let i = 0;
            const renderedMessages = messages.map((message) => {
                if (!message.user) {
                    return undefined;
                }
                return (
                    <div key={message.user.username + i++} className='lobby-message'>
                        {message.message}
                        {isModerator && (
                            <a
                                href='#'
                                className='btn no-padding'
                                onClick={(event) => handleRemoveMessageClick(message._id, event)}
                            >
                                <span className='chat-delete glyphicon glyphicon-remove' />
                            </a>
                        )}
                    </div>
                );
            });
            let userClass =
                'username' + (firstMessage.user.role ? ` ${firstMessage.user.role}-role` : '');
            return (
                <div key={timestamp + firstMessage.user.username + (index++).toString()}>
                    <Avatar username={firstMessage.user.username} float />
                    <span className={userClass}>{firstMessage.user.username}</span>
                    <span className='timestamp'>{timestamp}</span>
                    {renderedMessages}
                </div>
            );
        });
    }, [messages, isModerator, handleRemoveMessageClick]);

    if (messages.length === 0) {
        return <div>There are no messages at the moment.</div>;
    }

    return (
        <div className='lobby-messages' ref={messagesEndRef} onScroll={onScroll}>
            {getMessages()}
        </div>
    );
};

export default LobbyChat;
