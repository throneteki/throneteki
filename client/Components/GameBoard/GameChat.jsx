import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Messages from './Messages';
import { Button, Textarea } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import classNames from 'classnames';

const GameChat = ({
    isOpen,
    onClose,
    messages,
    onUnreadMessagesChange = () => {},
    onSendChat,
    muted,
    className
}) => {
    const [canScroll, setCanScroll] = useState(true);
    const [message, setMessage] = useState('');
    const messagePanel = useRef(null);

    const [unreadMessages, setUnreadMessages] = useState(0);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const onScroll = useCallback(() => {
        const messages = messagePanel.current;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        onSendChat(message);
        setMessage('');
    }, [message, onSendChat]);

    const onKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage();
                event.preventDefault();
            }
        },
        [sendMessage]
    );

    useEffect(() => {
        if (canScroll) {
            messagePanel.current.scrollTop = messagePanel.current.scrollHeight;
        }
        const unread = messages.length - lastMessageCount;
        if (isOpen && canScroll) {
            setLastMessageCount(messages.length);
            if (unread > 0) {
                setUnreadMessages(0);
                onUnreadMessagesChange(0);
            }
        } else {
            setUnreadMessages(unread);
            onUnreadMessagesChange(unread);
        }
    }, [canScroll, isOpen, lastMessageCount, messages, onUnreadMessagesChange]);

    const writeChatToClipboard = useCallback(() => {
        if (messagePanel.current) {
            navigator.clipboard
                .writeText(messagePanel.current.innerText)
                .then(() => toast.success('Copied game chat to clipboard', null))
                .catch((err) => toast.error(`Could not copy game chat: ${err}`, null));
        }
    }, []);

    const placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    // Drawer wrapper ensures we can "squish" the chat without it flowing off screen, as to avoid DnD-kit trying to auto-scroll off-screen whilst dragging near edge
    const drawerClass = useMemo(
        () =>
            classNames(
                className,
                'overflow-hidden transition-[width] duration-500 border-l-1 border-default-100',
                {
                    'w-full md:w-96': isOpen,
                    'w-0': !isOpen
                }
            ),
        [className, isOpen]
    );

    return (
        <div className={drawerClass}>
            <div className='flex flex-col bg-black/75 w-full h-full min-w-96'>
                <div className='flex p-2 gap-2 justify-end items-center'>
                    <span className='w-full text-large font-bold'>Game Log</span>
                    <Button
                        title={'Copy Chat Log to Clipboard'}
                        isIconOnly={true}
                        startContent={<FontAwesomeIcon icon={faCopy} />}
                        variant='faded'
                        radius='sm'
                        className='h-8'
                        onPress={writeChatToClipboard}
                    />
                    <Button
                        title={'Hide Chat Log'}
                        isIconOnly={true}
                        startContent={<FontAwesomeIcon icon={faArrowRight} />}
                        variant='faded'
                        radius='sm'
                        className='h-8'
                        onPress={onClose}
                    />
                </div>
                <div className='h-full relative overflow-hidden'>
                    <div
                        className='h-full overflow-auto flex flex-col gap-1.5 p-2 scroll-smooth'
                        ref={messagePanel}
                        onScroll={onScroll}
                    >
                        <Messages messages={messages} />
                    </div>
                    {unreadMessages > 0 && (
                        <Button
                            className='absolute bottom-0 bg-default-300 h-5 w-full animate-pulse text-white text-small text-center rounded-t-md'
                            radius='none'
                            onPress={() => setCanScroll(true)}
                        >
                            {'Click to view unread messages...'}
                        </Button>
                    )}
                </div>
                <Textarea
                    classNames={{ inputWrapper: 'rounded-none' }}
                    onKeyDown={onKeyDown}
                    onValueChange={setMessage}
                    placeholder={placeholder}
                    value={message}
                    minRows={1}
                ></Textarea>
            </div>
        </div>
    );
};

export default GameChat;
