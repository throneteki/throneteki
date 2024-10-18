import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import { getCardDimensions } from '../../util';

const PlayerRow = ({
    outOfGamePile,
    onCardClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    side,
    cardSize,
    isMe,
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
    faction,
    agendas
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
            return <Droppable source='out of game'>{outOfGamePileElement}</Droppable>;
        }

        return outOfGamePileElement;
    }, [
        outOfGamePile,
        onCardClick,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side,
        cardSize,
        isMe
    ]);

    const renderDroppablePile = useCallback(
        (source, cards) => {
            if (isMe) {
                return <Droppable source={source}>{cards}</Droppable>;
            }

            return cards;
        },
        [isMe]
    );

    const getAgenda = useCallback(() => {
        let agenda = agendas?.length > 0 ? agendas[0] : undefined;
        if (!agenda || agenda.code === '') {
            let className = classNames(
                'agenda card-pile vertical panel relative m-1 border-1 border-default-100 bg-opacity-65',
                {
                    [cardSize]: cardSize !== 'normal'
                }
            );
            return <div className={className} />;
        }
        let cardWidth = getCardDimensions(cardSize);

        let underneath = agenda.childCards ? [...agenda.childCards] : [];
        let disablePopup = underneath.length === 0;
        let title = !disablePopup ? 'Agenda' : null;
        let source = 'agenda';
        let pileClass = classNames('agenda', `agenda-${agenda.code}`);

        let additionalAgendas = agendas.slice(1);
        let spreadWidth = cardWidth.width / 2;

        let retAgendas = [];
        retAgendas.push(
            <div key={agenda.uuid} className={pileClass}>
                {renderDroppablePile(
                    source,
                    <CardPile
                        cards={underneath}
                        disablePopup={disablePopup}
                        onCardClick={onCardClick}
                        onMenuItemClick={onMenuItemClick}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        popupLocation={side}
                        showCards={true}
                        source={source}
                        title={title}
                        topCard={agenda}
                        size={cardSize}
                    />
                )}
            </div>
        );

        // Add all additional agendas separately (not as a CardPile)
        retAgendas = retAgendas.concat(
            additionalAgendas.map((agenda, index) => {
                let className = classNames('agenda', `agenda-${agenda.code} mt-1`);
                let style = { left: `${spreadWidth * (index + 1)}px` };
                return (
                    <div key={agenda.uuid} className={className}>
                        <Card
                            card={agenda}
                            source={source}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                            disableMouseOver={false}
                            onClick={onCardClick}
                            onMenuItemClick={onMenuItemClick}
                            orientation='vertical'
                            size={cardSize}
                            style={style}
                        />
                    </div>
                );
            })
        );

        // 10 is the left + right padding of main agenda; ensures gap on right is equal to gap on left
        let totalWidth = 10 + cardWidth.width + spreadWidth * additionalAgendas.length;
        let totalStyle = { width: `${totalWidth}px` };
        return (
            <div className='relative flex' style={totalStyle}>
                {retAgendas.reverse()}
            </div>
        );
    }, [
        agendas,
        renderDroppablePile,
        onCardClick,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side,
        cardSize
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
            return <Droppable source='title'>{titleCardElement}</Droppable>;
        }

        return titleCardElement;
    }, [
        title,
        isMelee,
        onCardClick,
        onMenuItemClick,
        onMouseOut,
        onMouseOver,
        side,
        cardSize,
        isMe
    ]);

    let cardPileProps = {
        onCardClick: onCardClick,
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
            numColumns={5}
            className='discard'
            title='Discard'
            source='discard pile'
            cards={discardPile}
            {...cardPileProps}
        />
    );
    let retDeadPile = (
        <CardPile
            numColumns={5}
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
        <div className='flex'>
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
