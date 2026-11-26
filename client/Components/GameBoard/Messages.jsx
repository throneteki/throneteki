import React, { memo, useState } from 'react';
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

// A game alert is a line of the log like any other, marked by its icon and coloured by how much it matters
const alertStyles = {
    success: { icon: faCircleCheck, className: 'text-ink', iconClass: 'text-gold' },
    info: { icon: faCircleInfo, className: 'text-ink', iconClass: 'text-gold' },
    bell: { icon: faBell, className: 'text-gold', iconClass: 'text-gold' },
    warning: { icon: faTriangleExclamation, className: 'text-warning', iconClass: 'text-warning' },
    danger: { icon: faCircleExclamation, className: 'text-danger', iconClass: 'text-danger' }
};

const alertColours = {
    success: 'text-success',
    info: 'text-gold',
    danger: 'text-danger',
    bell: 'text-warning',
    warning: 'text-warning'
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

const processKeywords = (message, compact) => {
    const messages = [];
    let i = 0;

    for (const token of message.split(' ')) {
        const lowerToken = token.toLowerCase();

        if (tokens[lowerToken]) {
            const tokenEntry = tokens[lowerToken];

            // On one line of its own (compact) the image sits in the middle of the text, not on its baseline
            messages.push(
                <span
                    key={`${token}-${i++}`}
                    className={compact ? undefined : 'inline-flex gap-0.5'}
                >
                    {` ${token} `}
                    <img
                        className={classNames(tokenEntry.className, {
                            '!mt-0 align-middle': compact
                        })}
                        src={tokenEntry.imageSrc}
                    />
                </span>
            );
            messages.push(' ');
        } else {
            messages.push(token + ' ');
        }
    }

    return messages;
};

const formatMessageText = (message, compact) => {
    let index = 0;
    const messages = [];

    for (const [key, fragment] of Object.entries(message)) {
        if (fragment === null || fragment === undefined) {
            messages.push(null);

            continue;
        }

        if (key === 'alert') {
            const message = formatMessageText(fragment.message, compact);
            if (compact) {
                messages.push(
                    <span
                        key={index++}
                        className={classNames(
                            alertColours[fragment.type] ?? 'font-semibold text-ink',
                            {
                                capitalize: fragment.type === 'phasestart'
                            }
                        )}
                    >
                        {message}
                    </span>
                );
                continue;
            }
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
                                'flex items-start gap-1.5 font-medium',
                                style.className
                            )}
                        >
                            <FontAwesomeIcon
                                icon={style.icon}
                                className={classNames(
                                    'mt-[0.2em] shrink-0 text-[0.9em]',
                                    style.iconClass
                                )}
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
            messages.concat(formatMessageText(fragment.message, compact));
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
            messages.push(
                <ThronesIcon
                    key={index++}
                    icon={fragment}
                    className={compact ? 'align-middle leading-none' : undefined}
                />
            );
        } else {
            const messageFragment = processKeywords(fragment.toString(), compact);
            messages.push(
                <span key={index++} className='message-fragment'>
                    {messageFragment}
                </span>
            );
        }
    }

    return messages;
};

const Message = memo(function Message({ message, username, compact, arrive }) {
    // Decided once, when it first shows, so a re-render part way through never cuts the fade short
    const [arriving] = useState(arrive);
    const fragments = Object.values(message.message || {});
    const sender = fragments.find(isChatFragment);

    if (compact) {
        return (
            <div className={classNames('break-words', { 'chat-arrive': arriving })}>
                {formatMessageText(message.message, compact)}
            </div>
        );
    }

    if (sender) {
        const text = fragments.slice(fragments.indexOf(sender) + 1);

        return (
            <div
                className={classNames('flex gap-2 py-1 leading-[1.2rem]', {
                    '-mx-2 bg-white/[0.035] px-2': sender.name === username,
                    'opacity-60': message.pending,
                    'chat-arrive': arriving
                })}
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
        <div
            className={classNames('break-words leading-[1.2rem] text-ink-dim', {
                'opacity-60': message.pending,
                'chat-arrive': arriving
            })}
        >
            {formatMessageText(message.message)}
        </div>
    );
});

// compact: each message as a line of text, its alerts inline rather than as rules and panels, for showing one
// message on its own
// arriveFrom: the index from which messages are new, and fade in
const Messages = ({ messages, compact = false, arriveFrom = Infinity }) => {
    const username = useSelector((state) => state.auth.user?.username);

    return (
        <>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                    username={username}
                    compact={compact}
                    arrive={index >= arriveFrom}
                />
            ))}{' '}
        </>
    );
};

export default memo(Messages);
