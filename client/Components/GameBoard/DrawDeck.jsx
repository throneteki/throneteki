import React, { useCallback } from 'react';
import CardPile from './CardPile';
import { faEye, faShuffle } from '@fortawesome/free-solid-svg-icons';

const DrawDeck = ({
    isMe,
    playerName,
    showDeck,
    cards,
    cardCount,
    revealTopCard,
    onCardClick,
    onMenuItemClick,
    popupLocation,
    popupId,
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

    const drawDeckPopupMenu = [];

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

    const hasVisibleCards = !!cards && cards.some((card) => !card.facedown);

    return (
        <CardPile
            className='draw'
            cardCount={cardCount}
            cards={cards}
            disablePopup={!hasVisibleCards && (spectating || !isMe)}
            hiddenTopCard={!revealTopCard}
            numColumns={7}
            numRows={3.2}
            onCardClick={onCardClick}
            onMenuItemClick={onMenuItemClick}
            onPopupChange={handlePopupChange}
            popupLocation={popupLocation}
            popupId={popupId}
            popupMenu={drawDeckPopupMenu}
            size={size}
            source='draw deck'
            title='Draw'
            playerName={playerName}
        />
    );
};

export default DrawDeck;
