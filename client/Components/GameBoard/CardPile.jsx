import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

const CardPile = ({
    cards,
    menu,
    disablePopup,
    onPopupChange,
    source,
    onCardClick: propsOnCardClick,
    topCard,
    closeOnClick,
    disableMouseOver,
    onMouseOut,
    onMouseOver,
    onTouchMove,
    onMenuItemClick,
    size,
    popupMenu,
    onDragDrop,
    title,
    popupLocation = 'bottom',
    className,
    cardCount,
    orientation = 'vertical',
    hiddenTopCard
}) => {
    const [showPopup, setShowPopup] = useState(cards && cards.some((card) => card.selectable));
    const [showMenu, setShowMenu] = useState(false);

    const isTopCardSelectable = useMemo(
        () =>
            !topCard
                ? false
                : topCard.selectable && (!cards || cards.every((card) => card.unselectable)),
        [cards, topCard]
    );

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

            if (menu) {
                setShowMenu(!showMenu);
                return;
            }

            if (!disablePopup) {
                updatePopupVisibility(!showPopup);
            }
        },
        [menu, showMenu, showPopup, updatePopupVisibility, disablePopup]
    );

    const onTopCardClick = useCallback(() => {
        if (menu) {
            setShowMenu(!showMenu);
            return;
        }

        if (disablePopup || isTopCardSelectable) {
            if (propsOnCardClick && topCard) {
                propsOnCardClick(topCard);
            }

            return;
        }

        updatePopupVisibility(!showPopup);
    }, [
        menu,
        showMenu,
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
        let didHaveSelectableCard = cards && cards.some((card) => card.selectable);

        if (!didHaveSelectableCard && hasNewSelectableCard) {
            updatePopupVisibility(true);
        } else if (didHaveSelectableCard && !hasNewSelectableCard) {
            updatePopupVisibility(false);
        }
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
            source: source
        };

        if (cards && cards.some((card) => card.group)) {
            const cardGroup = cards.reduce((grouping, card) => {
                (grouping[card.group] = grouping[card.group] || []).push(card);

                return grouping;
            }, {});
            const sortedKeys = Object.keys(cardGroup).sort();
            for (const key of sortedKeys) {
                cardList.push(
                    <CardTiledList cards={cardGroup[key]} key={key} title={key} {...listProps} />
                );
            }
        } else {
            cardList = <CardTiledList cards={cards} {...listProps} />;
        }

        if (disablePopup || !showPopup) {
            return null;
        }

        let popupClass = classNames('panel', {
            'our-side': popupLocation === 'bottom'
        });

        let innerClass = classNames('inner', size);
        let linkIndex = 0;

        let retPopupMenu = popupMenu && (
            <div className='card-pile-buttons'>
                {popupMenu.map((menuItem) => {
                    return (
                        <a
                            className='btn btn-default'
                            key={linkIndex++}
                            onClick={() => onPopupMenuItemClick(menuItem)}
                        >
                            {menuItem.icon && (
                                <span className={`glyphicon glyphicon-${menuItem.icon}`} />
                            )}{' '}
                            {menuItem.text}
                        </a>
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
            >
                <Droppable onDragDrop={onDragDrop} source={source}>
                    <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                        {retPopupMenu}
                        <div className={innerClass}>{cardList}</div>
                    </div>
                </Droppable>
            </MovablePanel>
        );

        return popup;
    }, [
        cards,
        disableMouseOver,
        onCloseClick,
        onDragDrop,
        onMenuItemClick,
        onCardClick,
        onMouseOut,
        onMouseOver,
        onTouchMove,
        popupLocation,
        popupMenu,
        showPopup,
        size,
        source,
        title,
        disablePopup,
        onPopupMenuItemClick
    ]);

    const getMenu = () => {
        let menuIndex = 0;

        let menu = menu.map((item) => {
            return (
                <div
                    key={(menuIndex++).toString()}
                    className='menu-item'
                    onClick={() => onMenuItemClick(item)}
                >
                    {item.text}
                </div>
            );
        });

        return <div className='panel menu'>{menu}</div>;
    };

    let retClassName = classNames('panel', 'card-pile', className, {
        [size]: size !== 'normal',
        horizontal: orientation === 'horizontal' || orientation === 'kneeled',
        vertical: orientation === 'vertical'
    });

    let retCardCount = cardCount || (cards ? cards.length : '0');
    let headerText = title ? title + ' (' + retCardCount + ')' : '';
    let retTopCard = topCard || (cards ? cards[0] : null);
    let cardOrientation =
        orientation === 'horizontal' && retTopCard && retTopCard.facedown ? 'kneeled' : orientation;

    if (hiddenTopCard && !topCard) {
        retTopCard = { facedown: true };
    }

    return (
        <div className={retClassName} onClick={onCollectionClick}>
            <div className='panel-header'>{headerText}</div>
            {retTopCard ? (
                <Card
                    card={retTopCard}
                    source={source}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    disableMouseOver={hiddenTopCard}
                    onClick={onTopCardClick}
                    onMenuItemClick={onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            {showMenu && getMenu()}
            {getPopup()}
        </div>
    );
};

export default CardPile;
