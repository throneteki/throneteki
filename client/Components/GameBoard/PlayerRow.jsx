import React, { useCallback } from 'react';
import classNames from 'classnames';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';

const PlayerRow = ({
    outOfGamePile,
    onCardClick,
    onDragDrop,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    side,
    cardSize,
    isMe,
    agenda,
    bannerCards,
    conclavePile,
    title,
    isMelee,
    username,
    hand,
    numDrawCards,
    drawDeck,
    onDrawPopupChange,
    onShuffleClick,
    revealTopCard,
    showDeck,
    spectating,
    discardPile,
    deadPile,
    shadows,
    faction
}) => {
    const getOutOfGamePile = useCallback(() => {
        if (outOfGamePile.length === 0) {
            return;
        }

        let outOfGamePileElement = (
            <CardPile
                cards={outOfGamePile}
                className='additional-cards'
                onCardClick={onCardClick}
                onDragDrop={onDragDrop}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                orientation='kneeled'
                popupLocation={side}
                source='out of game'
                title='Out of Game'
                size={cardSize}
            />
        );

        if (isMe) {
            return (
                <Droppable onDragDrop={onDragDrop} source='out of game'>
                    {outOfGamePileElement}
                </Droppable>
            );
        }

        return outOfGamePileElement;
    }, [
        outOfGamePile,
        onCardClick,
        onDragDrop,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side,
        cardSize,
        isMe
    ]);

    const getAgenda = useCallback(() => {
        if (!agenda || agenda.code === '') {
            let className = classNames('agenda', 'card-pile', 'vertical', 'panel', {
                [cardSize]: cardSize !== 'normal'
            });
            return <div className={className} />;
        }

        let cards = [];
        let disablePopup = false;
        let title;
        let source = 'agenda';

        // Alliance
        if (agenda.code === '06018') {
            cards = bannerCards;
            title = 'Banners';
        } else if (agenda.code === '09045') {
            cards = conclavePile;
            source = 'conclave';
            title = 'Conclave';
            disablePopup = !isMe;
        }

        disablePopup = disablePopup || !cards || cards.length === 0;

        let pileClass = classNames('agenda', `agenda-${agenda.code}`);

        let pile = (
            <CardPile
                className={pileClass}
                cards={cards}
                disablePopup={disablePopup}
                onCardClick={onCardClick}
                onDragDrop={onDragDrop}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                popupLocation={side}
                source={source}
                title={title}
                topCard={agenda}
                size={cardSize}
            />
        );

        if (agenda.code === '09045') {
            return (
                <Droppable onDragDrop={onDragDrop} source='conclave'>
                    {pile}
                </Droppable>
            );
        }

        return pile;
    }, [
        agenda,
        bannerCards,
        conclavePile,
        cardSize,
        isMe,
        onCardClick,
        onDragDrop,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side
    ]);

    const getTitleCard = useCallback(() => {
        if (!title || !isMelee) {
            return null;
        }

        let titleCardElement = (
            <CardPile
                cards={[]}
                className='title'
                onCardClick={onCardClick}
                onDragDrop={onDragDrop}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                popupLocation={side}
                source='title'
                title={title.name}
                topCard={title}
                size={cardSize}
            />
        );

        if (isMe) {
            return (
                <Droppable onDragDrop={onDragDrop} source='title'>
                    {titleCardElement}
                </Droppable>
            );
        }

        return titleCardElement;
    }, [
        title,
        isMelee,
        onCardClick,
        onDragDrop,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side,
        cardSize,
        isMe
    ]);

    const renderDroppablePile = useCallback(
        (source, cards) => {
            let onDragDropCb = isMe ? onDragDrop : null;

            if (isMe) {
                return (
                    <Droppable onDragDrop={onDragDropCb} source={source}>
                        {cards}
                    </Droppable>
                );
            }

            return cards;
        },
        [isMe, onDragDrop]
    );

    let cardPileProps = {
        onCardClick: onCardClick,
        onDragDrop: onDragDrop,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        popupLocation: side,
        size: cardSize
    };

    let retHand = (
        <SquishableCardPanel
            cards={hand}
            className='panel hand'
            groupVisibleCards
            username={username}
            maxCards={5}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            source='hand'
            title='Hand'
            cardSize={cardSize}
        />
    );
    let retDrawDeck = (
        <DrawDeck
            cardCount={numDrawCards}
            cards={drawDeck}
            isMe={isMe}
            numDrawCards={numDrawCards}
            onPopupChange={onDrawPopupChange}
            onShuffleClick={onShuffleClick}
            revealTopCard={revealTopCard}
            showDeck={showDeck}
            spectating={spectating}
            {...cardPileProps}
        />
    );
    let retDiscardPile = (
        <CardPile
            className='discard'
            title='Discard'
            source='discard pile'
            cards={discardPile}
            {...cardPileProps}
        />
    );
    let retDeadPile = (
        <CardPile
            className='dead'
            title='Dead'
            source='dead pile'
            cards={deadPile}
            orientation='kneeled'
            {...cardPileProps}
        />
    );
    let retShadows = (
        <SquishableCardPanel
            cards={shadows}
            cardSize={cardSize}
            className='panel shadows'
            maxCards={2}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            source='shadows'
            title='Shadows'
            username={username}
        />
    );

    return (
        <div className='player-home-row-container'>
            <CardPile
                className='faction'
                source='faction'
                cards={[]}
                topCard={faction}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                disablePopup
                onCardClick={onCardClick}
                size={cardSize}
            />
            {getAgenda()}
            {getTitleCard()}
            {renderDroppablePile('hand', retHand)}
            {shadows.length !== 0 && renderDroppablePile('shadows', retShadows)}
            {renderDroppablePile('draw deck', retDrawDeck)}
            {renderDroppablePile('discard pile', retDiscardPile)}
            {renderDroppablePile('dead pile', retDeadPile)}
            {getOutOfGamePile()}
        </div>
    );
};

export default PlayerRow;
