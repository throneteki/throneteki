import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import Messages from './Messages';
import { Button, Tab, Tabs } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ChatArea from '../Site/ChatArea';
import { isChatMessage } from './chatMessages';

const filterKey = 'gameChatFilter';
const swipeDistance = 60;

// On a phone the chat drops down from the top, so it closes upwards; elsewhere it slides in from the right
const closesUpwards = () =>
    ['narrow', 'short'].includes(document.documentElement.dataset.boardLayout) ||
    window.matchMedia('(max-width: 767px)').matches;

const scrollPositions = (root) =>
    [...root.querySelectorAll('*')]
        .filter((el) => el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)
        .map((el) => [el, el.scrollTop, el.scrollLeft]);

// A swipe across the open chat, the way it closes, closes it. A swipe that scrolled something in it is a scroll.
const useSwipeToClose = (isOpen, onClose) => {
    const start = useRef(null);
    return {
        onTouchStart: (event) => {
            const touch = event.touches[0];
            start.current =
                isOpen && event.touches.length === 1
                    ? {
                          x: touch.clientX,
                          y: touch.clientY,
                          scrolls: scrollPositions(event.currentTarget)
                      }
                    : null;
        },
        onTouchEnd: (event) => {
            const from = start.current;
            start.current = null;
            const touch = event.changedTouches[0];
            if (!from || !touch) {
                return;
            }
            const scrolled = from.scrolls.some(
                ([el, top, left]) => el.scrollTop !== top || el.scrollLeft !== left
            );
            const dx = touch.clientX - from.x;
            const dy = touch.clientY - from.y;
            const closing = closesUpwards()
                ? -dy > swipeDistance && -dy > Math.abs(dx)
                : dx > swipeDistance && dx > Math.abs(dy);
            if (closing && !scrolled) {
                onClose();
            }
        }
    };
};
const savedFilter = () => {
    try {
        return localStorage.getItem(filterKey) === 'chat' ? 'chat' : 'all';
    } catch {
        return 'all';
    }
};

// The tab that opens and closes the chat, joined to its panel (on a phone it hangs below it; see index.css)
const ChatLip = ({ isOpen, unread, onToggle }) => (
    <button
        type='button'
        title={isOpen ? 'Hide chat' : 'Show chat'}
        aria-expanded={isOpen}
        onClick={onToggle}
        className='chat-lip tap-target z-[260] flex items-center justify-center border-default-100 bg-black/75 text-white'
    >
        <span aria-hidden className='chat-lip-flare chat-lip-flare-start text-default-100' />
        <span aria-hidden className='chat-lip-flare chat-lip-flare-end text-default-100' />
        {/* A chat bubble while closed and a cross while open, one fading into the other in the same place */}
        <span className='relative grid place-items-center'>
            <FontAwesomeIcon
                icon={faComment}
                className={classNames('chat-lip-icon col-start-1 row-start-1', {
                    'chat-lip-icon-hidden': isOpen
                })}
            />
            <FontAwesomeIcon
                icon={faCommentSlash}
                className={classNames('chat-lip-icon col-start-1 row-start-1', {
                    'chat-lip-icon-hidden': !isOpen
                })}
            />
        </span>
        {unread > 0 && (
            <span className='chat-lip-badge absolute -top-2 -left-2 min-w-5 h-5 px-1 rounded-full bg-danger text-white text-tiny font-bold flex items-center justify-center'>
                {unread > 99 ? '99+' : unread}
            </span>
        )}
    </button>
);

// onUnreadChange: chat messages that arrived while closed. newestFirst (phones): input and newest at the top, so the
// keyboard only covers the oldest.
const GameChat = ({
    isOpen,
    onToggle,
    messages,
    onSendChat,
    muted,
    className,
    inputRef,
    onUnreadChange,
    newestFirst = false
}) => {
    const messagePanel = useRef(null);
    const [filter, setFilter] = useState(savedFilter);
    const chooseFilter = (key) => {
        setFilter(key);
        try {
            localStorage.setItem(filterKey, key);
        } catch {
            // Remembering the choice is a nicety
        }
    };

    const chatCount = useMemo(() => messages.filter(isChatMessage).length, [messages]);
    const shown = useMemo(() => {
        const kept = filter === 'chat' ? messages.filter(isChatMessage) : messages;
        return newestFirst ? [...kept].reverse() : kept;
    }, [messages, filter, newestFirst]);
    // Every chat message is seen while the chat is open
    const [seen, setSeen] = useState(0);
    useEffect(() => {
        if (isOpen) {
            setSeen(chatCount);
        }
    }, [isOpen, chatCount]);
    const unread = isOpen ? 0 : Math.max(0, chatCount - seen);
    useEffect(() => {
        onUnreadChange?.(unread);
    }, [unread, onUnreadChange]);

    const writeChatToClipboard = useCallback(() => {
        if (messagePanel.current) {
            navigator.clipboard
                .writeText(messagePanel.current.innerText)
                .then(() => toast.success('Copied game chat to clipboard', null))
                .catch((err) => toast.error(`Could not copy game chat: ${err}`, null));
        }
    }, []);

    const swipe = useSwipeToClose(isOpen, onToggle);
    const placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    // The drawer squishes the chat rather than letting it flow off screen, so DnD-kit never auto-scrolls off screen
    return (
        <>
            <div
                aria-hidden
                className={classNames('chat-dim', { 'chat-open': isOpen })}
                onClick={isOpen ? onToggle : undefined}
            />
            <div className={classNames(className, 'chat-drawer', { 'chat-open': isOpen })}>
                <ChatLip isOpen={isOpen} unread={unread} onToggle={onToggle} />
                <div aria-hidden className='chat-edge bg-default-100' />
                <div className='h-full w-full overflow-hidden'>
                    <div
                        className='chat-body flex flex-col hud-zoom bg-black/75 w-full h-full'
                        {...swipe}
                    >
                        <div className='flex p-2 gap-2 items-center'>
                            <Button
                                title={'Copy Chat Log to Clipboard'}
                                isIconOnly={true}
                                startContent={<FontAwesomeIcon icon={faCopy} />}
                                variant='faded'
                                radius='sm'
                                className='h-8'
                                onPress={writeChatToClipboard}
                            />
                            <Tabs
                                aria-label='Show'
                                size='sm'
                                selectedKey={filter}
                                onSelectionChange={chooseFilter}
                                className='ml-auto'
                            >
                                <Tab key='chat' title='Chat' />
                                <Tab key='all' title='Chat + game log' />
                            </Tabs>
                        </div>
                        <ChatArea
                            ref={messagePanel}
                            classNames={{
                                wrapper: 'flex-1 min-h-0',
                                messages: 'flex flex-col gap-1.5 p-2 text-sm'
                            }}
                            isOpen={isOpen}
                            messageCount={shown.length}
                            newestFirst={newestFirst}
                            onSendMessage={onSendChat}
                            isInputDisabled={muted}
                            placeholder={placeholder}
                            inputRef={inputRef}
                        >
                            <Messages messages={shown} />
                        </ChatArea>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameChat;
