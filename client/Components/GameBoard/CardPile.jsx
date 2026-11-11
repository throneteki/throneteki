import React, { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useRenderCount } from '../../perf';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';
import LabelledGameArea from './LabelledGameArea';

import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cardBoxClass } from '../../cardScale';
import { registerPile } from '../../flip';

const CardPile = ({
    cards,
    disablePopup,
    disableBackground = false,
    onPopupChange,
    source,
    onCardClick: propsOnCardClick,
    topCard,
    closeOnClick,
    disableHover,
    numColumns,
    numRows,
    onMenuItemClick: propsOnMenuItemClick,
    popupMenu,
    title,
    titlePosition,
    playerName,
    popupLocation = 'bottom',
    popupId,
    className,
    style,
    cardCount,
    orientation = 'vertical',
    hiddenTopCard,
    hideUnderCard,
    showCards,
    selected,
    flipDeck,
    flipFrom
}) => {
    useRenderCount('CardPile');
    const [showPopup, setShowPopup] = useState(cards && cards.some((card) => card.selectable));
    const prevCards = useRef(cards);
    const areaRef = useRef(null);

    useLayoutEffect(
        () =>
            registerPile(`${popupId || ''}:${source}`, {
                el: areaRef.current,
                source,
                uuids: new Map((cards || []).map((card, index) => [card.uuid, index]))
            }),
        [cards, popupId, source]
    );

    const isTopCardSelectable = useMemo(() => {
        if (!topCard) {
            return false;
        }

        return topCard.selectable && (!cards || cards.every((card) => card.unselectable));
    }, [cards, topCard]);

    const topCardHasAction = !!(topCard?.selectable || topCard?.canPlay);

    const updatePopupVisibility = useCallback(
        (value) => {
            setShowPopup(value);

            if (onPopupChange) {
                onPopupChange({ source: source, visible: value });
            }
        },
        [onPopupChange, source]
    );

    const onCollectionClick = useCallback(
        (event) => {
            event.preventDefault();

            if (!disablePopup) {
                updatePopupVisibility(!showPopup);
            }
        },
        [showPopup, updatePopupVisibility, disablePopup]
    );

    const onTopCardClick = useCallback(() => {
        if (disablePopup || isTopCardSelectable || topCardHasAction) {
            if (propsOnCardClick && topCard) {
                propsOnCardClick(topCard);
            }

            return;
        }

        updatePopupVisibility(!showPopup);
    }, [
        showPopup,
        disablePopup,
        isTopCardSelectable,
        topCardHasAction,
        propsOnCardClick,
        topCard,
        updatePopupVisibility
    ]);

    const onCloseClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            updatePopupVisibility(!showPopup);
        },
        [showPopup, updatePopupVisibility]
    );

    const onCardClick = useCallback(
        (card) => {
            if (closeOnClick) {
                updatePopupVisibility(false);
            }

            if (propsOnCardClick) {
                propsOnCardClick(card);
            }
        },
        [closeOnClick, propsOnCardClick, updatePopupVisibility]
    );

    const onPopupMenuItemClick = useCallback(
        (menuItem) => {
            if (menuItem.handler) {
                menuItem.handler();
            }

            if (menuItem.close) {
                updatePopupVisibility(!showPopup);
            }
        },
        [showPopup, updatePopupVisibility]
    );

    useEffect(() => {
        const hasNewSelectableCard = cards && cards.some((card) => card.selectable);
        const didHaveSelectableCard =
            prevCards.current && prevCards.current.some((card) => card.selectable);

        if (!didHaveSelectableCard && hasNewSelectableCard) {
            updatePopupVisibility(true);
        } else if (didHaveSelectableCard && !hasNewSelectableCard) {
            updatePopupVisibility(false);
        }

        prevCards.current = cards;
    }, [cards, updatePopupVisibility]);

    const getPopup = useCallback(() => {
        let cardList = [];

        const listProps = {
            disableHover: disableHover,
            onCardClick: onCardClick,
            onMenuItemClick: onMenuItemClick,
            source: source,
            numColumns,
            numRows
        };

        if (cards && cards.some((card) => card.group)) {
            const cardGroup = cards.reduce((grouping, card) => {
                (grouping[card.group] = grouping[card.group] || []).push(card);

                return grouping;
            }, {});
            const sortedKeys = Object.keys(cardGroup).sort();
            for (const key of sortedKeys) {
                cardList.push(
                    <CardTiledList
                        cards={cardGroup[key]}
                        key={key}
                        title={key}
                        {...listProps}
                        showCards={showCards}
                    />
                );
            }
        } else {
            cardList = <CardTiledList cards={cards} {...listProps} showCards={showCards} />;
        }

        if (disablePopup || !showPopup) {
            return null;
        }

        const popupClass = classNames(
            'flex flex-col box-content border-1 border-default-200 bg-black/75 rounded-b-md overflow-hidden'
        );

        const retPopupMenu = popupMenu && (
            <div className='flex gap-1.5 p-2'>
                {popupMenu.map((menuItem, index) => {
                    return (
                        <Button
                            color='primary'
                            className='flex-1'
                            key={index}
                            onPress={() => onPopupMenuItemClick(menuItem)}
                            startContent={<FontAwesomeIcon icon={menuItem.icon} />}
                        >
                            {menuItem.text}
                        </Button>
                    );
                })}
            </div>
        );

        return (
            <MovablePanel
                id={popupId}
                anchorRef={areaRef}
                title={playerName ? `${playerName}'s ${title}` : title}
                name={source}
                onCloseClick={onCloseClick}
                side={popupLocation}
            >
                <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                    {retPopupMenu}
                    <Droppable source={source} className='overflow-auto'>
                        {cardList}
                    </Droppable>
                </div>
            </MovablePanel>
        );
    }, [
        disableHover,
        onCardClick,
        onMenuItemClick,
        source,
        numColumns,
        numRows,
        cards,
        disablePopup,
        showPopup,
        popupMenu,
        playerName,
        title,
        onCloseClick,
        popupLocation,
        popupId,
        showCards,
        onPopupMenuItemClick
    ]);

    // A sideways card is laid out as an upright one, so the area is held to the height of a sideways card
    const areaStyle = useMemo(
        () =>
            orientation === 'horizontal'
                ? { height: 'calc(var(--card-scale, 1) * 4rem)', ...style }
                : style,
        [orientation, style]
    );
    const retClassName = classNames('flex w-fit h-fit', className);

    const retCardCount = cardCount || (cards ? cards.length : '0');
    const headerText = title ? title + ' (' + retCardCount + ')' : '';
    const shownTopCard = topCard || (cards ? cards[0] : null);
    const hiddenUuid = shownTopCard?.uuid;
    const hiddenUnselectable = shownTopCard?.unselectable;
    const retTopCard = useMemo(
        () =>
            shownTopCard && hiddenTopCard
                ? {
                      facedown: true,
                      selected,
                      uuid: hiddenUuid,
                      unselectable: hiddenUnselectable
                  }
                : shownTopCard,
        [shownTopCard, hiddenTopCard, selected, hiddenUuid, hiddenUnselectable]
    );

    // The card under the top one is drawn too, so it is already there when the top card is taken away
    const nextCard = cards
        ? topCard
            ? cards.find((card) => card.uuid !== topCard.uuid)
            : cards[1]
        : null;
    const nextUuid = nextCard?.uuid;
    const retNextCard = useMemo(
        () =>
            nextCard && (hiddenTopCard || hideUnderCard)
                ? { facedown: true, uuid: nextUuid }
                : nextCard,
        [nextCard, hiddenTopCard, hideUnderCard, nextUuid]
    );

    return (
        <LabelledGameArea
            ref={areaRef}
            label={headerText}
            position={titlePosition}
            className={retClassName}
            style={areaStyle}
            onClick={onCollectionClick}
            disableBackground={disableBackground}
            labelClickable={!disablePopup && topCardHasAction}
            data-flip-deck={flipDeck}
        >
            {retTopCard ? (
                <div className='relative'>
                    {retNextCard && (
                        <div key={retNextCard.uuid} className='absolute left-0 top-0'>
                            <Card
                                card={retNextCard}
                                source={source}
                                disableHover
                                orientation={orientation}
                                under
                                flip={!hiddenTopCard && !hideUnderCard}
                                flipFrom={flipFrom}
                            />
                        </div>
                    )}
                    <div key={retTopCard.uuid} className='relative'>
                        <Card
                            card={retTopCard}
                            source={source}
                            disableHover={hiddenTopCard}
                            onClick={onTopCardClick}
                            orientation={orientation}
                            flip={!hiddenTopCard}
                            flipFrom={flipFrom}
                        />
                    </div>
                </div>
            ) : (
                <div className={cardBoxClass(orientation)} />
            )}
            {getPopup()}
        </LabelledGameArea>
    );
};

export default CardPile;
