import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import { ItemTypes } from '../../constants';
import SquishableCardPanel from './SquishableCardPanel';

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

    const [{ isDragging, dragOffset }, drag, preview] = useDrag(() => ({
        type: ItemTypes.CARD,
        item: { card, source },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            dragOffset: monitor.getSourceClientOffset()
        })
    }));

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
            if (card.facedown) {
                dupe.facedown = true;
            }

            return (
                <Card
                    key={dupe.uuid}
                    className={classNames('card-dupe', `card-dupe-${index++}`)}
                    source={source}
                    card={dupe}
                    wrapped={false}
                    onMouseOver={disableMouseOver ? null : () => handleMouseOver(dupe)}
                    onMouseOut={disableMouseOver ? null : handleMouseOut}
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                    facedown={forceFaceup ? false : card.facedown}
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

        return <div className='card-order'>{card.order}</div>;
    };

    const getAlertStatus = () => {
        if (!card.alertStatus) {
            return null;
        }

        return (
            <div className={'status-container ' + card.alertStatus.type}>
                <div className='status-icon glyphicon glyphicon-exclamation-sign' />
                <span className='status-message'>{card.alertStatus.message}</span>
            </div>
        );
    };

    const isFacedown = () => {
        return forceFaceup ? false : card.facedown || !card.code;
    };

    const getDragFrame = useCallback(
        (image) => {
            if (!isDragging) {
                return null;
            }

            let style = {};
            if (dragOffset && isDragging) {
                let x = dragOffset.x;
                let y = dragOffset.y;
                style = { left: x, top: y };
            }
            return (
                <div className='drag-preview' style={style} ref={preview}>
                    {image}
                </div>
            );
        },
        [dragOffset, isDragging, preview]
    );

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        let cardClass = classNames(
            'card',
            `card-type-${card.type}`,
            className,
            sizeClass,
            statusClass,
            {
                'custom-card': card.code && card.code.startsWith('custom'),
                horizontal: orientation !== 'vertical' || card.kneeled,
                vertical: orientation === 'vertical' && !card.kneeled,
                unselectable: card.unselectable,
                dragging: isDragging
            }
        );
        let imageClass = classNames('card-image', sizeClass, {
            horizontal: card.type === 'plot',
            vertical: card.type !== 'plot',
            kneeled:
                card.type !== 'plot' &&
                (orientation === 'kneeled' || card.kneeled || orientation === 'horizontal')
        });

        let image = <img className={imageClass} src={imageUrl} />;

        let content = (
            <div className='card-frame' ref={drag}>
                {getDragFrame(image)}
                {getCardOrder()}
                <div
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

    const sizeClass = { [size]: size !== 'normal' };
    const statusClass = card
        ? card.selected
            ? 'selected'
            : card.selectable
              ? 'selectable'
              : card.inDanger
                ? 'in-danger'
                : card.saved
                  ? 'saved'
                  : card.inChallenge
                    ? 'challenge'
                    : card.isContributing
                      ? 'contributing'
                      : card.stealth
                        ? 'stealth'
                        : card.assault
                          ? 'assault'
                          : card.controlled
                            ? 'controlled'
                            : card.new
                              ? 'new'
                              : undefined
        : undefined;

    return wrapped ? (
        <div className='card-wrapper' style={style}>
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
