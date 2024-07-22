import React, { useState, useEffect, useRef, useCallback } from 'react';
import $ from 'jquery';
import Messages from './Messages';

const GameChat = ({ messages, onCardMouseOver, onCardMouseOut, onSendChat, muted }) => {
    const [canScroll, setCanScroll] = useState(true);
    const [message, setMessage] = useState('');
    const messagePanel = useRef(null);

    const onScroll = useCallback(() => {
        let messages = messagePanel.current;

        setTimeout(() => {
            if (messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                setCanScroll(true);
            } else {
                setCanScroll(false);
            }
        }, 500);
    }, []);

    const onChange = useCallback((event) => {
        setMessage(event.target.value);
    }, []);

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        onSendChat(message);
        setMessage('');
    }, [message, onSendChat]);

    const onKeyPress = useCallback(
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
            console.info('scrolling', $(messagePanel.current));
            $(messagePanel.current).scrollTop(999999);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canScroll, JSON.stringify(messages)]);

    let placeholder = muted ? 'Spectators cannot chat in this game' : 'Chat...';

    return (
        <div className='chat'>
            <div className='messages panel' ref={messagePanel} onScroll={onScroll}>
                <Messages
                    messages={messages}
                    onCardMouseOver={onCardMouseOver}
                    onCardMouseOut={onCardMouseOut}
                />
            </div>
            <form className='form chat-form'>
                <input
                    className='form-control'
                    placeholder={placeholder}
                    onKeyPress={onKeyPress}
                    onChange={onChange}
                    value={message}
                    disabled={muted}
                />
            </form>
        </div>
    );
};

export default GameChat;
