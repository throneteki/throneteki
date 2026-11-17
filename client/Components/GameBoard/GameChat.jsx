import React, { useRef, useCallback, useState } from 'react';
import Messages from './Messages';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCopy, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ChatArea from '../Site/ChatArea';

// A tab joined to the chat panel, at the edge of the screen while the chat is closed and on the edge of the
// panel while it is open, so the same tab opens and closes it. Beside the panel on a wide screen; on a phone the
// chat drops down from the top and the tab hangs below it (laid out in index.css).
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
                icon={faXmark}
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

// onUnreadChange: told how many messages arrived while the chat was closed, for a chat button elsewhere
const GameChat = ({
    isOpen,
    onToggle,
    messages,
    onSendChat,
    muted,
    className,
    inputRef,
    onUnreadChange
}) => {
    const messagePanel = useRef(null);
    const [unread, setUnread] = useState(0);

    const writeChatToClipboard = useCallback(() => {
        if (messagePanel.current) {
            navigator.clipboard
                .writeText(messagePanel.current.innerText)
                .then(() => toast.success('Copied game chat to clipboard', null))
                .catch((err) => toast.error(`Could not copy game chat: ${err}`, null));
        }
    }, []);

    const placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    // The drawer squishes the chat rather than letting it flow off screen, so DnD-kit never auto-scrolls off
    // screen while dragging near the edge. The lip sits outside the drawer, so only the inside is clipped.
    // On a phone the board behind the open chat is dimmed, and tapping it closes the chat
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
                    <div className='chat-body flex flex-col hud-zoom bg-black/75 w-full h-full'>
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
                        </div>
                        <ChatArea
                            ref={messagePanel}
                            classNames={{
                                wrapper: 'flex-1 min-h-0',
                                messages: 'flex flex-col gap-1.5 p-2'
                            }}
                            isOpen={isOpen}
                            messageCount={messages.length}
                            onSendMessage={onSendChat}
                            isInputDisabled={muted}
                            placeholder={placeholder}
                            onUnreadMessagesChange={(count) => {
                                setUnread(count);
                                onUnreadChange?.(count);
                            }}
                            inputRef={inputRef}
                        >
                            <Messages messages={messages} />
                        </ChatArea>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameChat;
