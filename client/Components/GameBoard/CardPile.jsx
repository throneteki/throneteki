import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';
import LabelledGameArea from './LabelledGameArea';

import './CardPileLink.scss';
import './CardPile.css';
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CardPile = ({
    cards,
    disablePopup,
    onPopupChange,
    source,
    onCardClick: propsOnCardClick,
    topCard,
    closeOnClick,
    disableMouseOver,
    numColumns,
    onMouseOut,
    onMouseOver,
    onTouchMove,
    onMenuItemClick,
    size,
    popupMenu,
    title,
    titlePosition,
    popupLocation = 'bottom',
    className,
    cardCount,
    orientation = 'vertical',
    hiddenTopCard,
    showCards
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
        let hasNewSelectableCard = cards && cards.some((card) => card.selectable);
        let didHaveSelectableCard =
            prevCards.current && prevCards.current.some((card) => card.selectable);

        if (!didHaveSelectableCard && hasNewSelectableCard) {
            updatePopupVisibility(true);
        } else if (didHaveSelectableCard && !hasNewSelectableCard) {
            updatePopupVisibility(false);
        }

        prevCards.current = cards;
    }, [cards, updatePopupVisibility]);

    const getPopup = useCallback(() => {
        let popup = null;
        let cardList = [];

        let listProps = {
            disableMouseOver: disableMouseOver,
            onCardClick: onCardClick,
            onCardMouseOut: onMouseOut,
            onCardMouseOver: onMouseOver,
            onTouchMove: onTouchMove,
            onMenuItemClick: onMenuItemClick,
            size: size,
            source: source,
            numColumns
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
            'card-list-popup relative margin-2 border-1 border-default-200 bg-black/75 rounded-b-md h-full',
            {
                'our-side': popupLocation === 'bottom',
                [size]: true
            }
        );

        let innerClass = classNames('inner overflow-y-auto px-2 pb-2 mt-2', size);
        let linkIndex = 0;

        let retPopupMenu = popupMenu && (
            <div className='flex'>
                {popupMenu.map((menuItem) => {
                    return (
                        <Button
                            color='primary'
                            className='flex-1 mx-2 mt-2'
                            key={linkIndex++}
                            onClick={() => onPopupMenuItemClick(menuItem)}
                        >
                            <span>
                                {menuItem.icon && <FontAwesomeIcon icon={menuItem.icon} />}{' '}
                                {menuItem.text}
                            </span>
                        </Button>
                    );
                })}
            </div>
        );

        popup = (
            <MovablePanel
                title={title}
                name={source}
                onCloseClick={onCloseClick}
                side={popupLocation}
                size={size}
            >
                <Droppable source={source} size={size}>
                    <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                        {retPopupMenu}
                        <div className={innerClass}>{cardList}</div>
                    </div>
                </Droppable>
            </MovablePanel>
        );

        return popup;
    }, [
        disableMouseOver,
        onCardClick,
        onMouseOut,
        onMouseOver,
        onTouchMove,
        onMenuItemClick,
        size,
        source,
        numColumns,
        cards,
        disablePopup,
        showPopup,
        popupLocation,
        popupMenu,
        title,
        onCloseClick,
        showCards,
        onPopupMenuItemClick
    ]);

    let retClassName = classNames(
        'card-pile',
        'box-border relative bg-black/55 rounded-md',
        className,
        {
            [size]: size !== 'normal',
            horizontal: orientation === 'horizontal' || orientation === 'kneeled',
            vertical: orientation === 'vertical'
        }
    );

    let retCardCount = cardCount || (cards ? cards.length : '0');
    let headerText = title ? title + ' (' + retCardCount + ')' : '';
    let retTopCard = topCard || (cards ? cards[0] : null);
    let cardOrientation =
        orientation === 'horizontal' && retTopCard && retTopCard.facedown ? 'kneeled' : orientation;

    if (hiddenTopCard && !topCard) {
        retTopCard = { facedown: true };
    }

    let menu;
    // Note "Open/Close Popup" item will never be available for CardPiles in locations that use select in non-triggerable ways (eg. click to force stand or kneel)
    // For example, if CardPile is ever used in play area, it will need to know when "clicking" on it is a valid option to do something
    if (!disablePopup && topCard?.selectable) {
        menu = [{ showPopup: true, text: `${showPopup ? 'Close' : 'Open'} Popup` }];
    }

    return (
        <LabelledGameArea
            label={headerText}
            position={titlePosition}
            className={retClassName}
            onClick={onCollectionClick}
        >
            <div className='inner-border absolute border-2 border-default-100/55 w-full h-full rounded-md' />
            {retTopCard ? (
                <Card
                    card={retTopCard}
                    source={source}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    disableMouseOver={hiddenTopCard}
                    menu={menu}
                    onClick={onTopCardClick}
                    onMenuItemClick={onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            {getPopup()}
        </LabelledGameArea>
    );
};

export default CardPile;
