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
    className
}) => {
    const messagePanel = useRef(null);

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
                <ChatArea
                    ref={messagePanel}
                    classNames={{
                        wrapper: 'flex-1 min-h-0',
                        messages: 'flex flex-col gap-1.5 p-2'
                    }}
                    isOpen={isOpen}
                    messageFragments={<Messages messages={messages} />}
                    messageCount={messages.length}
                    onSendMessage={onSendChat}
                    isInputDisabled={muted}
                    placeholder={placeholder}
                    onUnreadMessagesChange={onUnreadMessagesChange}
                />
            </div>
        </div>
    );
};

export default GameChat;
