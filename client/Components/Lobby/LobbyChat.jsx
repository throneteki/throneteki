import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@heroui/react';
import classNames from 'classnames';
import UserAvatar from '../Site/UserAvatar';
import { Constants } from '../../constants';
import { useRemoveMessageMutation } from '../../redux/middleware/api';
import { toast } from 'react-toastify';
import ChatArea from '../Site/ChatArea';
import { useDispatch } from 'react-redux';
import { clearChatStatus, sendLobbyChatMessage } from '../../redux/reducers/lobby';
import { getMessageWithLinks } from '../../util';

const GroupMinutes = 5;

const RoleLabels = {
    admin: 'Admin',
    contributor: 'Contributor',
    supporter: 'Supporter',
    winner: 'Winner',
    previouswinner: 'Past winner'
};

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const LobbyChat = ({ isLoggedIn, username, messages, isModerator, lobbyError }) => {
    const dispatch = useDispatch();
    const [removeMessage] = useRemoveMessageMutation();

    const onRemoveMessageClick = useCallback(
        async (messageId) => {
            try {
                await removeMessage(messageId).unwrap();
            } catch (err) {
                toast.error('Failed to remove message. Check console for details');
                console.info(err);
            }
        },
        [removeMessage]
    );

    useEffect(() => {
        if (!lobbyError) {
            return;
        }

        toast.error('New users are limited from chatting in the lobby, try again later');

        const timer = setTimeout(() => dispatch(clearChatStatus()), 5000);

        return () => clearTimeout(timer);
    }, [lobbyError, dispatch]);

    const getMessages = useCallback(() => {
        const today = moment();
        const yesterday = moment().subtract(1, 'day');
        const mention = username
            ? new RegExp(`(^|[^\\w])@?${escapeRegExp(username)}(?![\\w])`, 'i')
            : null;
        const dayLabel = (time) => {
            if (today.isSame(time, 'day')) {
                return 'Today';
            }

            if (yesterday.isSame(time, 'day')) {
                return 'Yesterday';
            }

            return moment(time).format(today.isSame(time, 'year') ? 'D MMMM' : 'D MMMM YYYY');
        };

        const groups = [];
        for (const message of messages) {
            if (!message.user) {
                continue;
            }

            const last = groups[groups.length - 1];
            const lastMessage = last?.messages[last.messages.length - 1];
            const sameDay = lastMessage && moment(lastMessage.time).isSame(message.time, 'day');
            if (
                last &&
                sameDay &&
                last.user.username === message.user.username &&
                moment(message.time).diff(lastMessage.time, 'minutes') < GroupMinutes
            ) {
                last.messages.push(message);
            } else {
                groups.push({
                    user: message.user,
                    day: sameDay ? null : dayLabel(message.time),
                    messages: [message]
                });
            }
        }

        const renderLine = (message, isFirst) => {
            const isMention =
                !message.deleted &&
                mention &&
                message.user.username !== username &&
                mention.test(message.message);
            let messageText;

            if (message.deleted) {
                const removedBy = message.deletedBy
                    ? `Removed by ${message.deletedBy}`
                    : 'Removed by a moderator';
                messageText =
                    isModerator && message.message ? (
                        <>
                            <span className='line-through'>{message.message}</span>{' '}
                            <span className='italic text-ink-faint'>({removedBy})</span>
                        </>
                    ) : (
                        <span className='italic text-ink-faint'>{removedBy}</span>
                    );
            } else {
                messageText = getMessageWithLinks(message.message);
            }

            return (
                <div
                    key={message._id ?? message.time}
                    className={classNames(
                        'group/line relative flex gap-2 py-px pr-1 text-sm leading-relaxed',
                        isMention ? '-mx-1.5 bg-gold/10 px-1.5 text-ink' : 'text-ink/90'
                    )}
                >
                    {!isFirst && (
                        <time
                            dateTime={moment(message.time).toISOString()}
                            className='absolute -left-11 top-px w-8 text-right text-[11px] leading-relaxed tabular-nums text-ink-faint opacity-0 group-hover/line:opacity-100'
                        >
                            {moment(message.time).format('H:mm')}
                        </time>
                    )}
                    <span className='min-w-0 [overflow-wrap:anywhere]'>{messageText}</span>
                    {isModerator && !message.deleted && (
                        <Button
                            isIconOnly
                            size='sm'
                            variant='ghost'
                            aria-label='Remove message'
                            className='ms-auto h-6 w-6 min-w-6 shrink-0 text-danger [@media(hover:hover)]:opacity-0 group-hover/line:opacity-100 focus-visible:opacity-100'
                            onPress={() => onRemoveMessageClick(message._id)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    )}
                </div>
            );
        };

        return groups.map((group) => {
            const role = group.user.role?.toLowerCase();
            const isMine = group.user.username === username;
            const first = group.messages[0];

            return (
                <React.Fragment key={first._id ?? `${group.user.username}${first.time}`}>
                    {group.day && (
                        <div
                            role='separator'
                            className='flex items-center gap-3 pt-1 font-display text-xs font-semibold text-gold/80'
                        >
                            <span className='h-px flex-1 bg-gold-hair' />
                            {group.day}
                            <span className='h-px flex-1 bg-gold-hair' />
                        </div>
                    )}
                    <div
                        className={classNames('flex gap-3', isMine && '-mx-2 bg-well px-2 py-1.5')}
                    >
                        <UserAvatar username={group.user.username} size='sm' />
                        <div className='min-w-0 flex-1'>
                            <div className='flex items-baseline gap-2'>
                                <span
                                    className={classNames(
                                        'font-medium',
                                        (role && Constants.ColorClassByRole[role]) || 'text-ink'
                                    )}
                                >
                                    {group.user.username}
                                </span>
                                {RoleLabels[role] && (
                                    <span className='text-xs text-ink-faint'>
                                        {RoleLabels[role]}
                                    </span>
                                )}
                                <time
                                    dateTime={moment(first.time).toISOString()}
                                    className='text-xs tabular-nums text-ink-faint'
                                >
                                    {moment(first.time).format('H:mm')}
                                </time>
                            </div>
                            {group.messages.map((message, index) =>
                                renderLine(message, index === 0)
                            )}
                        </div>
                    </div>
                </React.Fragment>
            );
        });
    }, [messages, username, isModerator, onRemoveMessageClick]);

    const noMessagesLabel = (
        <p className='py-6 text-center text-sm text-ink-dim'>No messages yet. Say hello.</p>
    );

    const placeholder = isLoggedIn ? 'Send a message' : 'Log in to chat';
    return (
        <ChatArea
            className='min-h-0 flex-1'
            classNames={{ messages: 'flex flex-col gap-3 overflow-x-hidden px-2 pb-3' }}
            messageCount={messages.length}
            noMessagesLabel={noMessagesLabel}
            onSendMessage={(message) => dispatch(sendLobbyChatMessage(message))}
            isInputDisabled={!isLoggedIn}
            placeholder={placeholder}
            maxInputLength={512}
        >
            {getMessages()}
        </ChatArea>
    );
};

export default LobbyChat;
