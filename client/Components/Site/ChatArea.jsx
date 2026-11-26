import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Textarea } from '@heroui/react';
import classNames from 'classnames';

const glideDuration = 150;

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
        glide = false
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

    // glide: messages arriving in the open chat slide the older ones up quickly rather than jumping them. The glide
    // follows the bottom each frame, so anything else keeping the chat anchored meanwhile leaves it to finish.
    const glideFrame = useRef(0);
    const wasOpen = useRef(isOpen);
    useEffect(() => () => cancelAnimationFrame(glideFrame.current), []);
    const scrollToBottom = useCallback(
        (smoothly) => {
            const el = messagesRef.current;
            if (!el || glideFrame.current) {
                return;
            }
            if (!smoothly || document.documentElement.dataset.motion === 'off') {
                el.scrollTop = el.scrollHeight;
                return;
            }
            const from = el.scrollTop;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min(1, (now - start) / glideDuration);
                const target = el.scrollHeight - el.clientHeight;
                el.scrollTop = from + (target - from) * (1 - (1 - progress) ** 3);
                glideFrame.current = progress < 1 ? requestAnimationFrame(step) : 0;
            };
            glideFrame.current = requestAnimationFrame(step);
        },
        [messagesRef]
    );

    // Determines if the user is "anchored" to the bottom of the chat
    const onScroll = useCallback(() => {
        if (messagesRef.current && !glideFrame.current) {
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
        const arrivedWhileOpen = wasOpen.current && unread > 0 && lastMessageCount > 0;
        wasOpen.current = isOpen;
        if (isOpen && isAnchored) {
            // Keep it anchored to the bottom
            scrollToBottom(glide && arrivedWhileOpen);
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
        glide,
        scrollToBottom,
        onUnreadMessagesChange
    ]);

    // Handles anchoring when it changes size (eg. the input box takes up more space due to new line)
    useEffect(() => {
        if (messagesRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (isAnchored) {
                    scrollToBottom(false);
                }
            });
            resizeObserver.observe(messagesRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isAnchored, messagesRef, scrollToBottom]);

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
                {unreadMessages > 0 && (
                    <Button
                        className='absolute bottom-full bg-default-300 h-5 w-full opacity-80 text-white text-small text-center rounded-t-md'
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
