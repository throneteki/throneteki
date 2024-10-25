import React, { useState, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import SquishableCardPanel from './SquishableCardPanel';

import './Card.scss';
import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Card = ({
    card,
    className,
    disableMouseOver,
    hideTokens,
    menu,
    onClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    orientation = 'vertical',
    size,
    source,
    style,
    wrapped = true,
    forceFaceup = false
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [startPosition, setStartPosition] = useState();
    const dragRef = useRef(null);

    const key = `card-${card.uuid}-${source}`;

    useDndMonitor({
        onDragEnd() {
            setStartPosition();
        }
    });

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

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: key,
        data: { type: ItemTypes.CARD, card, source, key: key }
    });

    const sizeClass = useMemo(() => ({ [size]: size !== 'normal' }), [size]);

    const isAllowedMenuSource = useCallback(() => {
        return source === 'play area' || source === 'agenda' || source === 'revealed plots';
    }, [source]);

    const handleMouseOver = useCallback(
        (c) => {
            if (onMouseOver) {
                onMouseOver(c);
            }
        },
        [onMouseOver]
    );

    const handleMouseOut = useCallback(() => {
        if (onMouseOut) {
            onMouseOut();
        }
    }, [onMouseOut]);

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
        let retMenu = menu || [];

        if (card.menu) {
            retMenu = retMenu.concat(card.menu);
        }

        return retMenu;
    }, [card.menu, menu]);

    const shouldShowMenu = useCallback(() => {
        return getMenu().some((item) => item.command !== 'click') && isAllowedMenuSource();
    }, [getMenu, isAllowedMenuSource]);

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
        let counters = [];
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
            counters = counters.concat(attachmentCounters);
        }

        return counters.filter((counter) => counter.count >= 0);
    };

    const getAttachments = () => {
        if (!['full deck', 'play area'].includes(source)) {
            return null;
        }

        let index = 1;

        return card.attachments.map((attachment) => (
            <Card
                key={attachment.uuid}
                source={source}
                card={attachment}
                className={classNames('attachment', `attachment-${index++}`)}
                wrapped={false}
                hideTokens
                onMouseOver={disableMouseOver ? null : () => handleMouseOver(attachment)}
                onMouseOut={disableMouseOver ? null : handleMouseOut}
                onClick={onClick}
                onMenuItemClick={onMenuItemClick}
                size={size}
            />
        ));
    };

    const getDupes = () => {
        if (source !== 'play area') {
            return null;
        }

        let index = 1;

        return card.dupes.map((dupe) => {
            const dupeCopy = Object.assign({}, dupe);

            dupeCopy.facedown = card.facedown;

            return (
                <Card
                    key={dupe.uuid}
                    className={classNames('card-dupe', `card-dupe-${index++}`)}
                    source={source}
                    card={dupeCopy}
                    wrapped={false}
                    onMouseOver={disableMouseOver ? null : () => handleMouseOver(dupe)}
                    onMouseOut={disableMouseOver ? null : handleMouseOut}
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                    facedown={forceFaceup ? false : card.facedown}
                    hideTokens
                />
            );
        });
    };

    const renderUnderneathCards = () => {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = card.childCards;
        if (!underneathCards || underneathCards.length === 0 || card.type === 'agenda') {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            <SquishableCardPanel
                cardSize={size}
                cards={underneathCards}
                className='underneath'
                maxCards={maxCards}
                onCardClick={onClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                source='underneath'
            />
        );
    };

    const getCardOrder = () => {
        if (!card.order) {
            return null;
        }

        return (
            <div className='absolute -top-7 w-6 text-white bg-black/80 font-bold h-6 text-center left-1/2 -mb-3 rounded-md border-1'>
                {card.order}
            </div>
        );
    };

    const getAlertStatus = () => {
        if (!card.alertStatus) {
            return null;
        }
        const iconClass = classNames('bg-black/50 p-1', {
            'text-warning': card.alertStatus.type === 'warning',
            'text-danger': card.alertStatus.type === 'error'
        });

        return (
            <div
                onMouseOut={() => setShowStatus(false)}
                onMouseOver={() => setShowStatus(true)}
                className={
                    'absolute top-0 left-0 flex items-center justify-center w-full h-1/2 ' +
                    card.alertStatus.type
                }
            >
                <div>
                    <FontAwesomeIcon className={iconClass} icon={faExclamationCircle} />
                </div>
                {showStatus && (
                    <span className='absolute w-full p-1 text-white bg-black/50 text-xs text-center break-words'>
                        {card.alertStatus.message}
                    </span>
                )}
            </div>
        );
    };

    const isFacedown = () => {
        return forceFaceup ? false : card.facedown || !card.code;
    };

    const getDragFrame = useCallback(
        (image) => {
            if (!transform) {
                return null;
            }

            if (!startPosition && dragRef.current) {
                setStartPosition(dragRef.current.getBoundingClientRect());
            }

            const x = startPosition?.left + transform.x;
            const y = startPosition?.top + transform.y;
            const style = { left: x, top: y };

            const dragClass = classNames(
                'card pointer-events-none fixed opacity-50 z-50',
                sizeClass,
                {
                    horizontal: orientation !== 'vertical' || card.kneeled,
                    vertical: orientation === 'vertical' && !card.kneeled
                }
            );
            return (
                <div className={dragClass} style={style} ref={dragRef}>
                    {image}
                </div>
            );
        },
        [card.kneeled, orientation, sizeClass, startPosition, transform]
    );

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        let cardClass = classNames('card overflow-hidden rounded-md', className, sizeClass, {
            'shadow-[0_0px_10px_1px] shadow-primary': card.selectable,
            'shadow-[0_0px_1px_4px] shadow-secondary': card.selected,
            'shadow-[0_0px_1px_2px] shadow-danger': card.inChallenge,
            'shadow-[0_0px_1px_2px] shadow-red-500': card.inDanger,
            'shadow-[0_0px_1px_2px] shadow-green-500': card.saved,
            'shadow-[0_0px_1px_2px] shadow-orange-200': card.isContributing,
            'shadow-[0_0px_1px_2px] shadow-orange-800': card.stealth || card.assault,
            'shadow-[0_0px_1px_2px] shadow-warning': card.controlled,
            'shadow-[0_0px_1px_2px] shadow-info': card.new,
            absolute: !!style?.left,
            relative: !style?.left,
            [`card-type-${card.type}`]: card.type,
            'custom-card': card.code && card.code.startsWith('custom'),
            horizontal: orientation !== 'vertical' || card.kneeled,
            vertical: orientation === 'vertical' && !card.kneeled,
            'grayscale brightness-75': card.unselectable,
            'z-10': !hideTokens
        });
        let imageClass = classNames('card-image absolute left-0 top-0', sizeClass, {
            horizontal: card.type === 'plot',
            vertical: card.type !== 'plot',
            kneeled:
                card.type !== 'plot' &&
                (orientation === 'kneeled' || card.kneeled || orientation === 'horizontal')
        });

        let image = <img className={imageClass} src={imageUrl} />;

        let content = (
            <div className='relative'>
                {getDragFrame(image)}
                {getCardOrder()}
                <div
                    {...listeners}
                    {...attributes}
                    ref={setNodeRef}
                    className={cardClass}
                    onMouseOver={disableMouseOver ? null : () => handleMouseOver(card)}
                    onMouseOut={disableMouseOver ? null : handleMouseOut}
                    onClick={handleClick}
                >
                    <div>
                        <span className='card-name'>{card.name}</span>
                        {image}
                    </div>
                    {!hideTokens ? <CardCounters counters={getCountersForCard(card)} /> : null}
                    {!isFacedown() ? getAlertStatus() : null}
                </div>
                {showMenu ? (
                    <CardMenu menu={getMenu()} onMenuItemClick={handleMenuItemClick} />
                ) : null}
            </div>
        );

        return content;
    };

    const imageUrl = !isFacedown()
        ? `/img/cards/${card.code}.png`
        : source === 'shadows'
          ? '/img/cards/cardback_shadow.png'
          : '/img/cards/cardback.png';

    const wrapperClass = classNames('m-0 inline-block select-none', {
        absolute: !!style?.left,
        relative: !style?.left
    });

    return wrapped ? (
        <div className={wrapperClass} style={style}>
            {getCard()}
            {getDupes()}
            {getAttachments()}
            {renderUnderneathCards()}
        </div>
    ) : (
        getCard()
    );
};

export default Card;
