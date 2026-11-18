import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Textarea } from '@heroui/react';
import classNames from 'classnames';

const ChatArea = forwardRef(function ChatArea(
    {
        className,
        classNames: classNamesProp,
        children,
        isOpen = true,
        messageCount,
        noMessagesLabel,
        onSendMessage,
        isInputDisabled,
        placeholder,
        maxInputLength,
        unreadMessagesLabel = 'Click to view unread messages...',
        onUnreadMessagesChange = () => {},
        inputRef,
        newestFirst = false
    },
    ref
) {
    const localMessageRef = useRef(null);
    const messagesRef = ref || localMessageRef;

    const [isAnchored, setIsAnchored] = useState(true);

    const [message, setMessage] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    // Tolerance (px) for scroll position to determine if the user is at the bottom
    const scrollTolerance = 25;

    // Newest first, the input sits above the messages and the newest are at the top, so the chat is anchored to
    // its top rather than its bottom
    const anchor = useCallback(
        (element) => {
            element.scrollTop = newestFirst ? 0 : element.scrollHeight;
        },
        [newestFirst]
    );

    // Determines if the user is "anchored" to the newest end of the chat
    const onScroll = useCallback(() => {
        if (messagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
            const isAtNewest = newestFirst
                ? scrollTop <= scrollTolerance
                : scrollTop + clientHeight >= scrollHeight - scrollTolerance;
            if (isAtNewest && !isAnchored) {
                setIsAnchored(true);
            } else if (!isAtNewest && isAnchored) {
                setIsAnchored(false);
            }
        }
    }, [isAnchored, messagesRef, newestFirst]);

    // Handles unread update & anchoring when new messages are received
    useEffect(() => {
        const unread = messageCount - lastMessageCount;
        if (isOpen && isAnchored) {
            if (messagesRef.current) {
                anchor(messagesRef.current);
            }
            setLastMessageCount(messageCount);
            setUnreadMessages(0);
            onUnreadMessagesChange(0);
        } else {
            setUnreadMessages(unread);
            onUnreadMessagesChange(unread);
        }
    }, [
        isOpen,
        isAnchored,
        lastMessageCount,
        messageCount,
        messagesRef,
        onUnreadMessagesChange,
        anchor
    ]);

    // Handles anchoring when it changes size (eg. the input box takes up more space due to new line)
    useEffect(() => {
        if (messagesRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (isAnchored) {
                    anchor(messagesRef.current);
                }
            });
            resizeObserver.observe(messagesRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isAnchored, messagesRef, anchor]);

    // Triggers send message
    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.currentTarget.blur();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            if (message !== '') {
                onSendMessage(message);
                setMessage('');
            }
        }
    };

    return (
        <div
            className={classNames(
                'flex',
                newestFirst ? 'flex-col-reverse' : 'flex-col',
                className,
                classNamesProp?.wrapper
            )}
        >
            <div
                className={classNames('flex-1 overflow-y-auto', classNamesProp?.messages)}
                ref={messagesRef}
                onScroll={onScroll}
            >
                {messageCount > 0 ? children : noMessagesLabel}
            </div>
            <div className='relative'>
                {unreadMessages > 0 && (
                    <Button
                        className={classNames(
                            'absolute h-5 w-full bg-default-300 text-center text-small text-white opacity-80',
                            newestFirst ? 'top-full z-10 rounded-b-md' : 'bottom-full rounded-t-md'
                        )}
                        radius='none'
                        onPress={() => setIsAnchored(true)}
                    >
                        {unreadMessagesLabel}
                    </Button>
                )}
                <Textarea
                    className={typeof classNamesProp?.input !== 'object' && classNamesProp?.input}
                    classNames={{
                        inputWrapper: 'rounded-none',
                        ...(typeof classNamesProp?.input === 'object' && classNamesProp?.input)
                    }}
                    ref={inputRef}
                    onKeyDown={onKeyDown}
                    onValueChange={setMessage}
                    maxLength={maxInputLength}
                    placeholder={placeholder}
                    disabled={isInputDisabled}
                    value={message}
                    minRows={1}
                />
            </div>
        </div>
    );
});

export default ChatArea;
