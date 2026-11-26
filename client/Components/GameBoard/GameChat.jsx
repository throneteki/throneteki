import React, { useRef, useCallback, useMemo } from 'react';
import Messages from './Messages';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import ChatArea from '../Site/ChatArea';

const GameChat = ({
    isOpen,
    onClose,
    messages,
    onUnreadMessagesChange = () => {},
    onSendChat,
    muted,
    className,
    inputRef
}) => {
    const messagePanel = useRef(null);

    const writeChatToClipboard = useCallback(() => {
        if (messagePanel.current) {
            navigator.clipboard
                .writeText(messagePanel.current.innerText)
                .then(() => toast.success('Game log copied'))
                .catch(() => toast.error('The game log could not be copied'));
        }
    }, []);

    const placeholder = muted ? 'Spectators can’t chat in this game' : 'Chat';

    // Drawer wrapper ensures we can "squish" the chat without it flowing off screen, as to avoid DnD-kit trying to auto-scroll off-screen whilst dragging near edge
    const drawerClass = useMemo(
        () =>
            classNames(
                className,
                'overflow-hidden transition-[width] duration-500 border-l border-gold-hair',
                {
                    'w-full md:w-96': isOpen,
                    'w-0': !isOpen
                }
            ),
        [className, isOpen]
    );

    return (
        <div className={drawerClass}>
            <div className='flex h-full w-full min-w-96 flex-col bg-[#0c0d11]/90'>
                <div className='flex items-center gap-1 border-b border-gold-hair px-3 py-2'>
                    <h2 className='flex-1 font-display text-base font-semibold text-gold'>
                        Game log
                    </h2>
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
                    <Button
                        aria-label='Hide the game log'
                        title='Hide the game log'
                        isIconOnly
                        size='sm'
                        variant='ghost'
                        className='text-ink-dim'
                        onPress={onClose}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Button>
                </div>
                <ChatArea
                    ref={messagePanel}
                    classNames={{
                        wrapper: 'flex-1 min-h-0',
                        messages: 'flex flex-col gap-1.5 overflow-x-hidden px-3 py-2 text-sm'
                    }}
                    isOpen={isOpen}
                    messageCount={messages.length}
                    onSendMessage={onSendChat}
                    isInputDisabled={muted}
                    placeholder={placeholder}
                    onUnreadMessagesChange={onUnreadMessagesChange}
                    inputRef={inputRef}
                >
                    <Messages messages={messages} />
                </ChatArea>
            </div>
        </div>
    );
};

export default GameChat;
