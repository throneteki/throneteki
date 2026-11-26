import React, { memo } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Link } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import UserAvatar from '../Site/UserAvatar';

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

const alertStyles = {
    success: {
        icon: faCircleCheck,
        className: 'border-gold-hair bg-gold/[0.05]',
        iconClass: 'text-gold'
    },
    info: {
        icon: faCircleInfo,
        className: 'border-gold-hair bg-gold/[0.05]',
        iconClass: 'text-gold'
    },
    bell: { icon: faBell, className: 'border-gold-line bg-gold/[0.08]', iconClass: 'text-gold' },
    warning: {
        icon: faTriangleExclamation,
        className: 'border-warning/40 bg-warning/[0.06]',
        iconClass: 'text-warning'
    },
    danger: {
        icon: faCircleExclamation,
        className: 'border-danger/40 bg-danger/[0.06]',
        iconClass: 'text-danger'
    }
};

const isChatFragment = (fragment) => fragment?.name && fragment.argType === 'player';

const Divider = ({ isRound, children }) => (
    <div
        className={classNames(
            'flex items-center gap-3 font-display font-semibold',
            isRound ? 'pt-3 text-sm text-gold' : 'pt-1 text-xs text-ink-dim'
        )}
    >
        <span className='h-px flex-1 bg-gold-hair' />
        <span className='first-letter:uppercase'>{children}</span>
        <span className='h-px flex-1 bg-gold-hair' />
    </div>
);

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
                case 'phasestart':
                    messages.push(
                        <Divider key={index++} isRound={fragment.type !== 'phasestart'}>
                            {message}
                        </Divider>
                    );
                    break;
                case 'success':
                case 'info':
                case 'danger':
                case 'bell':
                case 'warning': {
                    const style = alertStyles[fragment.type];
                    messages.push(
                        <div
                            key={index++}
                            role={fragment.type === 'danger' ? 'alert' : undefined}
                            className={classNames(
                                'flex items-start gap-2 border px-2.5 py-1.5 text-ink',
                                style.className
                            )}
                        >
                            <FontAwesomeIcon
                                icon={style.icon}
                                className={classNames('mt-0.5 shrink-0', style.iconClass)}
                            />
                            <span className='min-w-0'>{message}</span>
                        </div>
                    );
                    break;
                }

                default:
                    messages.concat(message);
                    break;
            }
        } else if (fragment.message) {
            messages.concat(formatMessageText(fragment.message));
        } else if (fragment.link && fragment.label) {
            messages.push(
                <Link key={index++} href={fragment.link} target='_blank' rel='noopener noreferrer'>
                    {fragment.label}
                </Link>
            );
        } else if (fragment.code && fragment.label) {
            messages.push(
                <span key={index++} className='cursor-pointer text-gold hover:text-ink'>
                    <CardHoverable code={fragment.code}>{fragment.label}</CardHoverable>
                </span>
            );
        } else if (isChatFragment(fragment)) {
            messages.push(
                <span
                    key={index++}
                    className={classNames(
                        'font-semibold',
                        Constants.ColorClassByRole[fragment.role] || 'text-ink'
                    )}
                >
                    {fragment.name}
                </span>
            );
        } else if (fragment.argType === 'nonAvatarPlayer') {
            const roleClass = Constants.ColorClassByRole[fragment.role?.toLowerCase()];
            const userClass = classNames('username font-semibold', roleClass || 'text-ink');

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

const Message = memo(function Message({ message, username }) {
    const fragments = Object.values(message.message || {});
    const sender = fragments.find(isChatFragment);

    if (sender) {
        const text = fragments.slice(fragments.indexOf(sender) + 1);

        return (
            <div
                className={classNames(
                    'flex gap-2 py-1',
                    sender.name === username && '-mx-2 bg-white/[0.035] px-2'
                )}
            >
                <UserAvatar username={sender.name} size='sm' className='mt-0.5 shrink-0' />
                <div className='min-w-0 flex-1 break-words'>
                    <span
                        className={classNames(
                            'block text-sm font-semibold',
                            Constants.ColorClassByRole[sender.role] || 'text-ink'
                        )}
                    >
                        {sender.name}
                    </span>
                    <span className='text-ink'>{formatMessageText(text)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className='break-words leading-[1.2rem] text-ink-dim'>
            {formatMessageText(message.message)}
        </div>
    );
});

const Messages = ({ messages }) => {
    const username = useSelector((state) => state.auth.user?.username);

    return (
        <>
            {messages.map((message, index) => (
                <Message key={index} message={message} username={username} />
            ))}{' '}
        </>
    );
};

export default memo(Messages);
