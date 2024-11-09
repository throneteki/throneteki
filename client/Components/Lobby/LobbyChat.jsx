import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@nextui-org/react';
import { Constants } from '../../constants';

const LobbyChat = ({ messages, isModerator, onRemoveMessageClick }) => {
    const [canScroll, setCanScroll] = useState(true);
    const messagesEndRef = useRef(null);

    const onScroll = useCallback(() => {
        let messagePanel = messagesEndRef.current;

        setTimeout(() => {
            if (
                messagePanel.scrollTop >=
                messagePanel.scrollHeight - messagePanel.offsetHeight - 20
            ) {
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

                let messageText;

                if (message.deleted) {
                    if (isModerator) {
                        messageText = (
                            <>
                                <span className='italic line-through'>{message.message}</span>
                                <span className='italic'>
                                    {' '}
                                    - (Message removed by {message.deletedBy})
                                </span>
                            </>
                        );
                    } else {
                        messageText = (
                            <span className='italic'>Message deleted by a moderator</span>
                        );
                    }
                } else {
                    messageText = message.message;
                }

                return (
                    <div key={message.user.username + i++} className='break-words'>
                        {messageText}
                        {isModerator && (
                            <a
                                href='#'
                                className='ml-2 text-danger'
                                onClick={() => onRemoveMessageClick(message._id)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </a>
                        )}
                    </div>
                );
            });

            const userClass =
                'username' +
                (firstMessage.user.role
                    ? ` ${Constants.ColourClassByRole[firstMessage.user.role.toLowerCase()]}`
                    : '');

            return (
                <div
                    key={timestamp + firstMessage.user.username + (index++).toString()}
                    className='mb-2 flex'
                >
                    <div className='mr-2'>
                        <Avatar
                            src={`/img/avatar/${firstMessage.user.username}.png`}
                            showFallback
                        />
                    </div>
                    <div className='overflow-x-hidden'>
                        <div className='flex'>
                            <span className={userClass}>{firstMessage.user.username}</span>
                            <span className='ml-2 text-white'>{timestamp}</span>
                        </div>
                        {renderedMessages}
                    </div>
                </div>
            );
        });
    }, [messages, isModerator, onRemoveMessageClick]);

    if (messages.length === 0) {
        return <div>There are no messages at the moment.</div>;
    }

    return (
        <div
            className='absolute bottom-10 left-2 right-0 top-0 overflow-y-auto'
            ref={messagesEndRef}
            onScroll={onScroll}
        >
            {getMessages()}
        </div>
    );
};

export default LobbyChat;
