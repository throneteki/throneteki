import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import { getCardDimensions } from '../../util';
import PlayerPlots from './PlayerPlots';

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
    agendas,
    plotDeck,
    plotDiscard,
    activePlot,
    selectedPlot,
    mustShowPlotSelection
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

    const getAgendas = useCallback(() => {
        const agenda = agendas?.length > 0 ? agendas[0] : undefined;
        if (!agenda || agenda.code === '') {
            return (
                // Show empty card pile to ensure empty slot looks consistent
                <CardPile
                    cards={[]}
                    disablePopup={true}
                    onCardClick={onCardClick}
                    onMenuItemClick={onMenuItemClick}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    popupLocation={side}
                    showCards={false}
                    source='agendas'
                    title={null}
                    topCard={null}
                    size={cardSize}
                />
            );
        }
        const cardWidth = getCardDimensions(cardSize);

        const underneath = agenda.childCards ? [...agenda.childCards] : [];
        const disablePopup = underneath.length === 0;
        const title = !disablePopup ? 'Agenda' : null;
        const source = 'agenda';
        const additionalAgendas = agendas.slice(1);
        const agendaClass = (a) => classNames('agenda', `agenda-${a.code}`);

        const spreadWidth = cardWidth.width / 2;

        const retAgendas = [
            <div key={agenda.uuid} className={agendaClass(agenda)}>
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
                        numColumns={5}
                    />
                )}
            </div>
        ];

        // Add all additional agendas separately (not as a CardPile)
        retAgendas.unshift(
            ...additionalAgendas.reverse().map((agenda) => {
                const style = { marginLeft: `-${spreadWidth}px` };
                return (
                    <div key={agenda.uuid} className={agendaClass(agenda)} style={style}>
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
                        />
                    </div>
                );
            })
        );
        return <div className='relative flex flex-row-reverse'>{retAgendas}</div>;
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
        <div className='flex space-x-2 m-1'>
            <PlayerPlots
                cardSize={cardSize}
                onCardClick={onCardClick}
                onCardMouseOut={onMouseOut}
                onCardMouseOver={onMouseOver}
                onMenuItemClick={onMenuItemClick}
                direction={isMe ? 'default' : 'reverse'}
                isMe={isMe}
                plotDeck={plotDeck}
                plotDiscard={plotDiscard}
                activePlot={activePlot}
                selectedPlot={selectedPlot}
                mustShowPlotSelection={mustShowPlotSelection}
            />
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
                orientation={faction && faction.kneeled ? 'horizontal' : 'vertical'}
            />
            {getAgendas()}
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
