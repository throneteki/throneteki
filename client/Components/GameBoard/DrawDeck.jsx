import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import CardPile from './CardPile';
import { pendingKeys } from './pendingActions';
import { faEye, faShuffle } from '@fortawesome/free-solid-svg-icons';

const DrawDeck = ({
    isMe,
    playerName,
    showDeck,
    cards,
    cardCount,
    revealTopCard,
    onCardClick,
    popupLocation,
    popupId,
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

    const manualMode = useSelector((state) => state.lobby.currentGame?.manualMode);
    const drawDeckPopupMenu = [];

    if (isMe && manualMode) {
        if (!showDeck) {
            drawDeckPopupMenu.push({
                text: 'View Hidden',
                icon: faEye,
                handler: handleShowDeckClick,
                pendingKey: pendingKeys.deck('show')
            });
        }
        drawDeckPopupMenu.push({
            text: 'Close and Shuffle',
            icon: faShuffle,
            handler: handleShuffleClick,
            pendingKey: pendingKeys.deck('shuffle'),
            close: true
        });
    }

    const hasVisibleCards = !!cards && cards.some((card) => !card.facedown);

    return (
        <CardPile
            className='draw'
            showDepth
            cardCount={cardCount}
            cards={cards}
            disablePopup={!hasVisibleCards && (spectating || !isMe)}
            hiddenTopCard={!revealTopCard}
            numColumns={7}
            numRows={3.2}
            onCardClick={onCardClick}
            onPopupChange={handlePopupChange}
            popupLocation={popupLocation}
            popupId={popupId}
            popupMenu={drawDeckPopupMenu}
            source='draw deck'
            title='Draw'
            flipDeck={playerName}
            playerName={playerName}
        />
    );
};

export default DrawDeck;
