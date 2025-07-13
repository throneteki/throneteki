import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Avatar, Link } from '@heroui/react';

import AlertPanel from '../Site/AlertPanel';

import CardBackImage from '../../assets/img/cardback.png';
import GoldImage from '../../assets/img/stats/gold.png';

import { Constants, ThronesIcons } from '../../constants';
import ThronesIcon from './ThronesIcon';
import CardHoverable from '../Images/CardHoverable';

const tokens = {
    card: { className: 'h-4 w-3 inline', imageSrc: CardBackImage },
    cards: { className: 'h-4 w-3 inline', imageSrc: CardBackImage },
    gold: { className: 'h-3 w-3 inline mt-1', imageSrc: GoldImage }
};

const Messages = ({ messages }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);

    const owner = currentGame.players[currentGame.owner];

    const processKeywords = (message) => {
        const messages = [];
        let i = 0;

        for (const token of message.split(' ')) {
            const lowerToken = token.toLowerCase();

            if (tokens[lowerToken]) {
                const tokenEntry = tokens[lowerToken];

                messages.push(
                    <span key={`${token}-${i++}`} className='inline-flex gap-0.5'>
                        {` ${token} `}
                        <img className={tokenEntry.className} src={tokenEntry.imageSrc} />
                    </span>
                );
                messages.push(' ');
            } else {
                messages.push(token + ' ');
            }
        }

        return messages;
    };

    const formatMessageText = (message) => {
        let index = 0;
        const messages = [];

        for (const [key, fragment] of Object.entries(message)) {
            if (fragment === null || fragment === undefined) {
                messages.push(null);

                continue;
            }

            if (key === 'alert') {
                const message = formatMessageText(fragment.message);
                switch (fragment.type) {
                    case 'startofround':
                    case 'endofround':
                    case 'phasestart': {
                        const className = classNames('font-bold text-foreground', {
                            'text-large': fragment.type === 'startofround',
                            'text-medium': fragment.type === 'phasestart',
                            capitalize: fragment.type === 'phasestart'
                        });
                        messages.push(
                            <div className={className} key={index++}>
                                <hr className='border-primary' />
                                <div className='my-3'>{message}</div>
                                {fragment.type === 'phasestart' && (
                                    <hr className='border-primary' />
                                )}
                            </div>
                        );
                        break;
                    }
                    case 'success':
                    case 'info':
                    case 'danger':
                    case 'bell':
                    case 'warning':
                        messages.push(
                            <AlertPanel variant={fragment.type} key={index++} size={'sm'}>
                                {message}
                            </AlertPanel>
                        );
                        break;

                    default:
                        messages.concat(message);
                        break;
                }
            } else if (fragment.message) {
                messages.concat(formatMessageText(fragment.message));
            } else if (fragment.link && fragment.label) {
                messages.push(
                    <Link key={index++} isExternal href={fragment.link}>
                        {fragment.label}
                    </Link>
                );
            } else if (fragment.code && fragment.label) {
                messages.push(
                    <span key={index++} className='cursor-pointer text-secondary hover:text-info'>
                        <CardHoverable code={fragment.code}>{fragment.label}</CardHoverable>
                    </span>
                );
            } else if (fragment.name && fragment.argType === 'player') {
                messages.push(
                    <div key={index++} className='message-chat flex items-center gap-1'>
                        <Avatar
                            src={`/img/avatar/${fragment.name}.png`}
                            showFallback
                            className='w-6 h-6 text-tiny'
                        />
                        <span key={index++} className={Constants.ColorClassByRole[fragment.role]}>
                            {fragment.name}
                        </span>
                    </div>
                );
            } else if (fragment.argType === 'nonAvatarPlayer') {
                const roleClass = Constants.ColorClassByRole[fragment.role?.toLowerCase()];
                const userClass = classNames('username font-bold', roleClass);

                messages.push(
                    <span key={index++} className={userClass}>
                        {fragment.name}
                    </span>
                );
            } else if (ThronesIcons.includes(fragment)) {
                messages.push(<ThronesIcon key={index++} icon={fragment} />);
            } else {
                const messageFragment = processKeywords(fragment.toString());
                messages.push(
                    <span key={index++} className='message-fragment'>
                        {messageFragment}
                    </span>
                );
            }
        }

        return messages;
    };

    const renderMessages = () => {
        return messages.map((message, index) => {
            // TODO: Re-add chat bubble triangles (left for this player, right for others)
            const className = classNames('break-words leading-[1.15rem] text-gray-300', {
                'p-2 bg-default rounded-md': Object.values(message.message).some(
                    (m) => m.name && m.argType === 'player'
                )
            });
            return (
                <div key={index} className={className}>
                    {formatMessageText(message.message)}
                </div>
            );
        });
    };

    return <>{renderMessages()} </>;
};

export default Messages;
