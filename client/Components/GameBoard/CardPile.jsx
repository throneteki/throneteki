import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';
import LabelledGameArea from './LabelledGameArea';

import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cardClass } from '../../util';

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
    size,
    popupMenu,
    title,
    titlePosition,
    popupLocation = 'bottom',
    className,
    cardCount,
    orientation = 'vertical',
    hiddenTopCard,
    showCards,
    selected
}) => {
    const [showPopup, setShowPopup] = useState(cards && cards.some((card) => card.selectable));
    const prevCards = useRef(cards);

    const isTopCardSelectable = useMemo(() => {
        if (!topCard) {
            return false;
        }

        return topCard.selectable && (!cards || cards.every((card) => card.unselectable));
    }, [cards, topCard]);

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
        if (disablePopup || isTopCardSelectable) {
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

    const onMenuItemClick = useCallback(
        (card, menuItem) => {
            if (menuItem.showPopup !== undefined) {
                updatePopupVisibility(menuItem.showPopup);
            }

            if (propsOnMenuItemClick) {
                propsOnMenuItemClick(card, menuItem);
            }
        },
        [updatePopupVisibility, propsOnMenuItemClick]
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
            size: size,
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
                title={title}
                name={source}
                onCloseClick={onCloseClick}
                side={popupLocation}
            >
                <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                    {retPopupMenu}
                    <Droppable source={source} size={size} className='overflow-auto'>
                        {cardList}
                    </Droppable>
                </div>
            </MovablePanel>
        );
    }, [
        disableHover,
        onCardClick,
        onMenuItemClick,
        size,
        source,
        numColumns,
        numRows,
        cards,
        disablePopup,
        showPopup,
        popupMenu,
        title,
        onCloseClick,
        popupLocation,
        showCards,
        onPopupMenuItemClick
    ]);

    const retClassName = classNames('flex w-fit h-fit', className);

    const retCardCount = cardCount || (cards ? cards.length : '0');
    const headerText = title ? title + ' (' + retCardCount + ')' : '';
    let retTopCard = topCard || (cards ? cards[0] : null);
    if (retTopCard && hiddenTopCard) {
        retTopCard = { facedown: true, selected, uuid: retTopCard.uuid };
    }

    let menu;
    // If popup is available, that should always be a menu item
    // Note: If popup is disabled, default Card menu will be used
    if (!disablePopup) {
        menu = [
            {
                hideable: true,
                showPopup: !showPopup,
                text: `${showPopup ? 'Close' : 'Open'} Popup`
            }
        ];

        // Additionally, if the top card is currently selectable, that also needs to be an option
        // Note: If CardPiles ever become available in locations where "Select Card" is always an option (such as "play area"), this will need to be permenantly enabled for those cards
        if (topCard?.selectable) {
            menu.push({ hideable: true, command: 'click', text: 'Select Card' });
        }
    }

    return (
        <LabelledGameArea
            label={headerText}
            position={titlePosition}
            className={retClassName}
            onClick={onCollectionClick}
            disableBackground={disableBackground}
        >
            {retTopCard ? (
                <Card
                    card={retTopCard}
                    source={source}
                    disableHover={hiddenTopCard}
                    menu={menu}
                    onClick={onTopCardClick}
                    onMenuItemClick={onMenuItemClick}
                    orientation={orientation}
                    size={size}
                />
            ) : (
                <div className={cardClass(size, orientation)} />
            )}
            {getPopup()}
        </LabelledGameArea>
    );
};

export default CardPile;
