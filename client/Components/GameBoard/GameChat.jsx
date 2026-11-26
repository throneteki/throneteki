import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import Messages from './Messages';
import { Tabs } from '@heroui/react';
import Button from '../Site/Button';
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
const tabClass = 'whitespace-nowrap px-3 text-sm';

const ChatLip = ({ isOpen, unread, onToggle }) => (
    <button
        type='button'
        title={isOpen ? 'Hide chat' : 'Show chat'}
        aria-expanded={isOpen}
        onClick={onToggle}
        className='chat-lip tap-target z-[260] flex items-center justify-center border-gold-line bg-panel/90 text-ink'
    >
        <span aria-hidden className='chat-lip-flare chat-lip-flare-start text-gold-line' />
        <span aria-hidden className='chat-lip-flare chat-lip-flare-end text-gold-line' />
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
            <span className='chat-lip-badge absolute -top-2 -left-2 min-w-5 h-5 px-1 rounded-full bg-danger text-ink text-xs font-bold flex items-center justify-center'>
                {unread > 99 ? '99+' : unread}
            </span>
        )}
    </button>
);

// onUnreadChange: chat messages that arrived while closed
const GameChat = ({
    isOpen,
    onToggle,
    messages,
    onSendChat,
    muted,
    className,
    inputRef,
    onUnreadChange,
    animate = false
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
    const shown = useMemo(
        () => (filter === 'chat' ? messages.filter(isChatMessage) : messages),
        [messages, filter]
    );
    // animate: messages arriving fade in and slide the rest up. Switching the filter swaps the whole list, so nothing
    // arrives then.
    const shownBefore = useRef({ filter, count: shown.length });
    const switched = shownBefore.current.filter !== filter;
    const arriveFrom = animate && !switched ? shownBefore.current.count : Infinity;
    useEffect(() => {
        shownBefore.current = { filter, count: shown.length };
    }, [filter, shown.length]);

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
                .then(() => toast.success('Game log copied'))
                .catch(() => toast.error('The game log could not be copied'));
        }
    }, []);

    const swipe = useSwipeToClose(isOpen, onToggle);
    const placeholder = muted ? 'Spectators can’t chat in this game' : 'Chat';

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
                <div aria-hidden className='chat-edge bg-gold-line' />
                <div className='chat-frame h-full w-full overflow-hidden'>
                    <div
                        className='chat-body flex flex-col hud-zoom bg-panel/90 w-full h-full'
                        {...swipe}
                    >
                        <div className='flex items-center gap-2 border-b border-gold-hair px-3 py-2'>
                            <Button
                                aria-label='Copy the game log'
                                title='Copy the game log'
                                isIconOnly
                                size='sm'
                                variant='ghost'
                                className='text-ink-dim'
                                onPress={writeChatToClipboard}
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </Button>
                            <Tabs
                                selectedKey={filter}
                                onSelectionChange={chooseFilter}
                                className='ml-auto'
                            >
                                <Tabs.ListContainer>
                                    <Tabs.List aria-label='Show'>
                                        <Tabs.Tab id='chat' className={tabClass}>
                                            Chat
                                            <Tabs.Indicator />
                                        </Tabs.Tab>
                                        <Tabs.Tab id='all' className={tabClass}>
                                            Chat and log
                                            <Tabs.Indicator />
                                        </Tabs.Tab>
                                    </Tabs.List>
                                </Tabs.ListContainer>
                            </Tabs>
                            {/* Only where the chat covers the whole board, hiding the button that opened it */}
                            <Button
                                aria-label='Hide chat'
                                title='Hide chat'
                                isIconOnly
                                variant='ghost'
                                className='chat-close hidden h-10 w-10 min-w-10 text-lg text-ink-dim'
                                onPress={onToggle}
                            >
                                <FontAwesomeIcon icon={faCommentSlash} />
                            </Button>
                        </div>
                        <ChatArea
                            ref={messagePanel}
                            classNames={{
                                wrapper: 'flex-1 min-h-0',
                                messages:
                                    'flex flex-col gap-1.5 overflow-x-hidden px-3 py-2 text-sm'
                            }}
                            isOpen={isOpen}
                            messageCount={shown.length}
                            onSendMessage={onSendChat}
                            isInputDisabled={muted}
                            placeholder={placeholder}
                            inputRef={inputRef}
                            glide={animate && !switched}
                        >
                            <Messages messages={shown} arriveFrom={arriveFrom} />
                        </ChatArea>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameChat;
