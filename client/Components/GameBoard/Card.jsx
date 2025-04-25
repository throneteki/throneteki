import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import SquishableCardPanel from './SquishableCardPanel';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useUniqueId } from '@dnd-kit/utilities';
import CardHoverable from '../Images/CardHoverable';
import CardImage from '../Images/CardImage';
import { cardClass, standardiseCardSize } from '../../util';
import { Tooltip } from '@heroui/react';

const Card = ({
    card,
    className,
    disableHover,
    hideTokens,
    menu = [{ hideable: true, command: 'click', text: 'Select Card' }],
    onClick,
    onMenuItemClick,
    orientation = 'vertical',
    size,
    source,
    style,
    wrapped = true,
    forceFaceup = false
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const key = `card-${card.uuid}-${source}`;

    const shortNames = {
        count: 'x',
        stand: 'T',
        poison: 'O',
        gold: 'G',
        valarmorghulis: 'V',
        betrayal: 'B',
        vengeance: 'N',
        ear: 'E',
        venom: 'M',
        kiss: 'K',
        bell: 'L',
        blood: 'D',
        shadow: 'W',
        journey: 'J',
        prayer: 'R',
        tale: 'A',
        ghost: 'H'
    };

    const standardisedSize = standardiseCardSize(size);
    let cardStackIndex = (card.attachments?.length || 0) + (card.childCards?.length > 0 ? 1 : 0);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: useUniqueId(key),
        data: { type: ItemTypes.CARD, card, orientation, source, key: key }
    });

    const isAllowedMenuSource = useCallback(
        () => ['play area', 'agenda', 'revealed plots'].includes(source),
        [source]
    );

    const handleMenuItemClick = useCallback(
        (menuItem) => {
            if (onMenuItemClick) {
                onMenuItemClick(card, menuItem);
                setShowMenu(!showMenu);
            }
        },
        [card, onMenuItemClick, showMenu]
    );

    const getMenu = useCallback(() => {
        const retMenu = [...menu] || [];

        if (card.menu) {
            retMenu.push(...card.menu);
        }

        return retMenu;
    }, [card.menu, menu]);

    const shouldShowMenu = useCallback(
        () => getMenu().some((item) => item.command !== 'click') && isAllowedMenuSource(),
        [getMenu, isAllowedMenuSource]
    );

    const handleClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (shouldShowMenu()) {
                setShowMenu(!showMenu);
                return;
            }

            onClick && onClick(card);
        },
        [card, onClick, shouldShowMenu, showMenu]
    );

    const getCountersForCard = (card) => {
        const counters = [];
        if (card.power) {
            counters.push({ name: 'card-power', count: card.power, shortName: 'P' });
        }

        if (!card.facedown && source === 'play area') {
            if (card.type === 'character' && card.baseStrength !== card.strength) {
                counters.push({ name: 'strength', count: card.strength, shortName: 'S' });
            }

            if (card.dupes && card.dupes.length > 0) {
                counters.push({ name: 'dupe', count: card.dupes.length, shortName: 'D' });
            }

            for (const icon of card.iconsAdded || []) {
                counters.push({ name: 'challenge-icon', icon, count: 0, cancel: false });
            }

            for (const icon of card.iconsRemoved || []) {
                counters.push({ name: 'challenge-icon', icon, count: 0, cancel: true });
            }

            for (const item of card.factionStatus || []) {
                counters.push({
                    name: 'faction',
                    icon: item.faction,
                    count: 0,
                    cancel: item.status === 'lost'
                });
            }
        }

        for (const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, shortName: shortNames[key] });
        }

        for (const attachment of card.attachments || []) {
            let attachmentCounters = getCountersForCard(attachment).map((counter) =>
                Object.assign({ fade: true }, counter)
            );
            counters.push(...attachmentCounters);
        }

        return counters.filter((counter) => counter.count >= 0);
    };

    const getAttachments = () => {
        if (source !== 'play area') {
            return null;
        }

        return card.attachments.map((attachment) => {
            return (
                <Card
                    key={attachment.uuid}
                    style={{
                        zIndex: cardStackIndex--
                    }}
                    source={source}
                    card={attachment}
                    className={`attachment-${standardisedSize}`}
                    wrapped={false}
                    hideTokens
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                />
            );
        });
    };

    const getDupes = () => {
        if (source !== 'play area') {
            return null;
        }

        return card.dupes.map((dupe) => {
            const dupeCopy = Object.assign({}, dupe);

            dupeCopy.facedown = card.facedown;

            return (
                <Card
                    key={dupe.uuid}
                    className={`duplicate-${standardisedSize}`}
                    source={source}
                    card={dupeCopy}
                    wrapped={false}
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                    facedown={forceFaceup ? false : card.facedown}
                    hideTokens
                />
            );
        });
    };

    const getUnderneath = () => {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        const underneathCards = card.childCards;
        if (!underneathCards || underneathCards.length === 0 || card.type === 'agenda') {
            return null;
        }

        const maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            // Using attachment class as to ensure underneath cards are visually shown underneath the stack
            // Attachments & card zIndex's consider these underneath cards to ensure this is rendered at bottom of attachment stack
            <div
                className={`relative attachment-${standardisedSize}`}
                style={{ zIndex: cardStackIndex-- }}
            >
                <SquishableCardPanel
                    cardSize={size}
                    cards={underneathCards}
                    className='underneath'
                    maxCards={maxCards}
                    onCardClick={onClick}
                    source='underneath'
                />
            </div>
        );
    };

    const getCardOrder = () => {
        if (!card.order) {
            return null;
        }

        return (
            <div className='absolute w-6 h-6 -ml-3 -top-7 left-1/2 text-white bg-black/80 font-bold text-center rounded-md border-1'>
                {card.order}
            </div>
        );
    };

    const getAlertStatus = () => {
        if (!card.alertStatus) {
            return null;
        }
        const iconClass = classNames('animate-pulse', {
            'text-warning': card.alertStatus.type === 'warning',
            'text-danger': card.alertStatus.type === 'error'
        });
        const content = <span className='select-none'>{card.alertStatus.message}</span>;
        return (
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <Tooltip content={content} showArrow={true}>
                    <FontAwesomeIcon className={iconClass} icon={faExclamationCircle} />
                </Tooltip>
            </div>
        );
    };

    // Need to get classes in priority, as tailwind is not consistent in CSS priority
    const getHighlightClass = () => {
        if (card.selected) {
            return 'shadow-[0_0_2px_4px] shadow-green-400';
        }
        if (card.selectable) {
            return 'shadow-[0_0_8px_4px] shadow-slate-300';
        }
        if (card.inChallenge) {
            return 'shadow-[0_0_1px_2px] shadow-red-500';
        }
        if (card.inDanger) {
            return 'shadow-[0_0_1px_2px] shadow-red-900';
        }
        if (card.saved) {
            return 'shadow-[0_0_1px_2px] shadow-green-500';
        }
        if (card.isContributing) {
            return 'shadow-[0_0_1px_2px] shadow-orange-200';
        }
        if (card.stealth || card.assault) {
            return 'shadow-[0_0_1px_2px] shadow-orange-800';
        }
        if (card.controlled) {
            return 'shadow-[0_0_1px_2px] shadow-yellow-300';
        }
        if (card.new) {
            return 'shadow-[0_0_1px_2px] shadow-blue-100';
        }
    };
    const getCard = (style) => {
        if (!card) {
            return <div />;
        }

        // Wrapper class handles the rotating of knelt or horizontally placed vertical cards (eg. dead pile)
        const wrapperClass = classNames(
            'relative overflow-visible transition-all',
            cardClass(
                size,
                (card.type !== 'plot' && orientation === 'horizontal') || card.kneeled
                    ? 'rotated'
                    : orientation
            ),
            getHighlightClass(),
            {
                'grayscale brightness-75': card.unselectable
            }
        );
        const isFaceup = forceFaceup || (!card.facedown && card.code);
        const imageCode = isFaceup
            ? card.code
            : source === 'shadows'
              ? 'cardback_shadow'
              : 'cardback';
        const image = (
            <div
                {...listeners}
                {...attributes}
                className={wrapperClass}
                onClick={handleClick}
                style={{ zIndex: cardStackIndex--, ...style }}
            >
                {card.name && <span className='absolute left-0 top-0'>{card.name}</span>}
                <CardImage
                    ref={setNodeRef}
                    className='absolute left-0 top-0 touch-none'
                    size={size}
                    code={imageCode}
                    orientation={card.type === 'plot' ? 'horizontal' : 'vertical'}
                />
            </div>
        );
        return (
            <div
                className={classNames(
                    'relative transition-all',
                    cardClass(
                        size,
                        orientation === 'vertical' && card.kneeled ? 'kneeled' : orientation
                    ),
                    className
                )}
            >
                {disableHover ? (
                    image
                ) : (
                    <CardHoverable
                        code={card.code}
                        isDisabled={isDragging || showMenu}
                        touchDelay={250}
                    >
                        {image}
                    </CardHoverable>
                )}
                {showMenu ? (
                    <CardMenu menu={getMenu()} onMenuItemClick={handleMenuItemClick} />
                ) : null}
                {!hideTokens ? <CardCounters counters={getCountersForCard(card)} /> : null}
                {isFaceup ? getAlertStatus() : null}
                {getCardOrder()}
            </div>
        );
    };

    // Explicitly setting z-index to 0 to ensure context is stacked independently per card
    const wrapperClass = classNames('inline-block select-none z-0', {
        absolute: !!style?.left,
        relative: !style?.left
    });

    return wrapped ? (
        <div className={wrapperClass} style={style}>
            {getDupes()}
            {getCard()}
            {getAttachments()}
            {getUnderneath()}
        </div>
    ) : (
        getCard(style)
    );
};

export default Card;
