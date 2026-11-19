import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { TextAreaField } from './Field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
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
        onUnreadMessagesChange = () => {},
        inputRef
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

    // Determines if the user is "anchored" to the bottom of the chat
    const onScroll = useCallback(() => {
        if (messagesRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollTolerance;
            if (isAtBottom && !isAnchored) {
                setIsAnchored(true);
            } else if (!isAtBottom && isAnchored) {
                setIsAnchored(false);
            }
        }
    }, [isAnchored, messagesRef]);

    // Handles unread update & anchoring when new messages are received
    useEffect(() => {
        const unread = messageCount - lastMessageCount;
        if (isOpen && isAnchored) {
            if (messagesRef.current) {
                // Keep it anchored to the bottom
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }
            setLastMessageCount(messageCount);
            setUnreadMessages(0);
            onUnreadMessagesChange(0);
        } else {
            setUnreadMessages(unread);
            onUnreadMessagesChange(unread);
        }
    }, [isOpen, isAnchored, lastMessageCount, messageCount, messagesRef, onUnreadMessagesChange]);

    // Handles anchoring when it changes size (eg. the input box takes up more space due to new line)
    useEffect(() => {
        if (messagesRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (isAnchored) {
                    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
                }
            });
            resizeObserver.observe(messagesRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isAnchored, messagesRef]);

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
        <div className={classNames('flex flex-col', className, classNamesProp?.wrapper)}>
            <div
                className={classNames('flex-1 overflow-y-auto', classNamesProp?.messages)}
                ref={messagesRef}
                onScroll={onScroll}
            >
                {messageCount > 0 ? children : noMessagesLabel}
            </div>
            <div className='relative'>
                {!isAnchored && messageCount > 0 && (
                    <button
                        type='button'
                        onClick={() => setIsAnchored(true)}
                        className='absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-gold-line bg-[#0c0d11] px-3 py-1 text-xs text-ink shadow-[0_6px_16px_rgba(0,0,0,0.5)] hover:border-gold'
                    >
                        <FontAwesomeIcon icon={faArrowDown} className='text-[0.7rem] text-gold' />
                        {unreadMessages > 0
                            ? `${unreadMessages} new ${unreadMessages === 1 ? 'message' : 'messages'}`
                            : 'Jump to latest'}
                    </button>
                )}
                <TextAreaField
                    className={
                        typeof classNamesProp?.input === 'string' ? classNamesProp.input : undefined
                    }
                    inputClassName='max-h-40 min-h-10 resize-none [field-sizing:content]'
                    aria-label={placeholder || 'Message'}
                    ref={inputRef}
                    onKeyDown={onKeyDown}
                    onValueChange={setMessage}
                    maxLength={maxInputLength}
                    placeholder={placeholder}
                    isDisabled={isInputDisabled}
                    value={message}
                    minRows={1}
                />
            </div>
        </div>
    );
});

export default ChatArea;
