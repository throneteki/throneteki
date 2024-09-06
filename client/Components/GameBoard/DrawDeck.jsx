import React, { useCallback } from 'react';
import CardPile from './CardPile';
import Droppable from './Droppable';
import { faEye, faShuffle } from '@fortawesome/free-solid-svg-icons';

const DrawDeck = ({
    isMe,
    showDeck,
    cards,
    cardCount,
    revealTopCard,
    onCardClick,
    onDragDrop,
    onMouseOut,
    onMouseOver,
    popupLocation,
    size,
    spectating,
    onPopupChange,
    onShuffleClick
}) => {
    const handleShowDeckClick = useCallback(() => {
        if (onPopupChange) {
            onPopupChange({ visible: true });
        }
    }, [onPopupChange]);

    const handleShuffleClick = useCallback(() => {
        if (onShuffleClick) {
            onShuffleClick();
        }
    }, [onShuffleClick]);

    const handlePopupChange = useCallback(
        (event) => {
            if (onPopupChange && !event.visible) {
                onPopupChange({ visible: false });
            }
        },
        [onPopupChange]
    );

    const renderDroppablePile = useCallback(
        (source, child) => {
            return isMe ? (
                <Droppable onDragDrop={onDragDrop} source={source}>
                    {child}
                </Droppable>
            ) : (
                child
            );
        },
        [isMe, onDragDrop]
    );

    let drawDeckPopupMenu = [];

    if (isMe) {
        if (!showDeck) {
            drawDeckPopupMenu.push({
                text: 'View Hidden',
                icon: faEye,
                handler: handleShowDeckClick
            });
        }
        drawDeckPopupMenu.push({
            text: 'Close and Shuffle',
            icon: faShuffle,
            handler: handleShuffleClick,
            close: true
        });
    }

    let hasVisibleCards = !!cards && cards.some((card) => !card.facedown);

    let drawDeck = (
        <CardPile
            className='draw'
            cardCount={cardCount}
            cards={cards}
            disablePopup={!hasVisibleCards && (spectating || !isMe)}
            hiddenTopCard={!revealTopCard}
            onCardClick={onCardClick}
            onDragDrop={onDragDrop}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            onPopupChange={handlePopupChange}
            popupLocation={popupLocation}
            popupMenu={drawDeckPopupMenu}
            size={size}
            source='draw deck'
            title='Draw'
        />
    );

    return renderDroppablePile('draw deck', drawDeck);
};

export default DrawDeck;
