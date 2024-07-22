import React, { useCallback, useMemo } from 'react';
import Avatar from '../Site/Avatar';
import { ThronesIcons } from '../../constants';

const Messages = ({ messages, onCardMouseOver, onCardMouseOut }) => {
    const tokens = useMemo(
        () => ({
            card: { className: 'icon-card', imageSrc: '/img/cards/cardback.png' },
            cards: { className: 'icon-card', imageSrc: '/img/cards/cardback.png' },
            gold: { className: 'icon-gold', imageSrc: '/img/Gold.png' }
        }),
        []
    );

    const processKeywords = useCallback(
        (message) => {
            let messages = [];
            let i = 0;

            for (let token of message.split(' ')) {
                if (tokens[token]) {
                    let tokenEntry = tokens[token];
                    messages.push(
                        <img
                            key={`${token}-${i++}`}
                            className={tokenEntry.className}
                            src={tokenEntry.imageSrc}
                        />
                    );
                    messages.push(' ');
                } else {
                    messages.push(token + ' ');
                }
            }

            return messages;
        },
        [tokens]
    );

    const formatMessageText = useCallback(
        (message) => {
            let index = 0;
            let messages = [];
            for (const [key, fragment] of Object.entries(message)) {
                if (fragment === null || fragment === undefined) {
                    messages.push('');
                    continue;
                }
                if (key === 'alert') {
                    let message = formatMessageText(fragment.message);
                    switch (fragment.type) {
                        case 'endofround':
                        case 'phasestart':
                        case 'startofround':
                            messages.push(
                                <div className={'bold seperator ' + fragment.type} key={index++}>
                                    <hr className={fragment.type} />
                                    {message}
                                    {fragment.type === 'phasestart' && <hr />}
                                </div>
                            );
                            break;
                        case 'success':
                            messages.push(
                                <div className='alert alert-success' key={index++}>
                                    <span className='glyphicon glyphicon-ok-sign' />
                                    &nbsp;
                                    {message}
                                </div>
                            );
                            break;
                        case 'info':
                            messages.push(
                                <div className='alert alert-info' key={index++}>
                                    <span className='glyphicon glyphicon-info-sign' />
                                    &nbsp;
                                    {message}
                                </div>
                            );
                            break;
                        case 'danger':
                            messages.push(
                                <div className='alert alert-danger' key={index++}>
                                    <span className='glyphicon glyphicon-exclamation-sign' />
                                    &nbsp;
                                    {message}
                                </div>
                            );
                            break;
                        case 'warning':
                            messages.push(
                                <div className='alert alert-warning' key={index++}>
                                    <span className='glyphicon glyphicon-warning-sign' />
                                    &nbsp;
                                    {message}
                                </div>
                            );
                            break;
                        default:
                            messages.push(message);
                            break;
                    }
                } else if (fragment.message) {
                    messages.push(formatMessageText(fragment.message));
                } else if (fragment.code && fragment.label) {
                    messages.push(
                        <span
                            key={index++}
                            className='card-link'
                            onMouseOver={() => onCardMouseOver(fragment)}
                            onMouseOut={onCardMouseOut}
                        >
                            {fragment.label}
                        </span>
                    );
                } else if (fragment.name && fragment.argType === 'player') {
                    let userClass = 'username' + (fragment.role ? ` ${fragment.role}-role` : '');
                    messages.push(
                        <div key={index++} className='message-chat'>
                            <Avatar username={fragment.name} float />
                            <span key={index++} className={userClass}>
                                {fragment.name}
                            </span>
                        </div>
                    );
                } else if (fragment.argType === 'nonAvatarPlayer') {
                    let userClass = 'username' + (fragment.role ? ` ${fragment.role}-role` : '');
                    messages.push(
                        <span key={index++} className={userClass}>
                            {fragment.name}
                        </span>
                    );
                } else if (ThronesIcons.includes(fragment)) {
                    messages.push(
                        <span key={index++} className={`thronesicon thronesicon-${fragment}`} />
                    );
                } else {
                    let messageFragment = processKeywords(fragment.toString());
                    messages.push(messageFragment);
                }
            }
            return messages;
        },
        [onCardMouseOver, onCardMouseOut, processKeywords]
    );

    const getMessage = useCallback(() => {
        let index = 0;
        return messages.map((message) => (
            <div key={'message' + index++} className='message'>
                {formatMessageText(message.message)}
            </div>
        ));
    }, [messages, formatMessageText]);

    return <div>{getMessage()}</div>;
};

export default Messages;
