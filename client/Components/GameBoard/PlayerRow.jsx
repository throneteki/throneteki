import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import { standardiseCardSize } from '../../util';
import PlayerPlots from './PlayerPlots';

const PlayerRow = ({
    className,
    outOfGamePile,
    onCardClick,
    onMenuItemClick,
    side,
    sideNo,
    cardSize,
    isMe,
    playerName,
    title,
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
    mustShowPlotSelection,
    showHiddenPiles = false
}) => {
    const renderDroppablePile = useCallback(
        (source, cards) => {
            if (isMe) {
                return <Droppable source={source}>{cards}</Droppable>;
            }

            return cards;
        },
        [isMe]
    );

    const getAgendas = useCallback(
        (cardPileProps) => {
            const agenda = agendas?.length > 0 ? agendas[0] : undefined;
            if (!agenda || agenda.code === '') {
                return (
                    // Show empty card pile to ensure empty slot looks consistent
                    <CardPile
                        cards={[]}
                        disablePopup={true}
                        showCards={false}
                        source='agendas'
                        title={null}
                        topCard={null}
                        {...cardPileProps}
                    />
                );
            }

            const underneath = agenda.childCards ? [...agenda.childCards] : [];
            const disablePopup = underneath.length === 0;
            const title = !disablePopup ? 'Agenda' : null;
            const source = 'agenda';
            const additionalAgendas = agendas.slice(1);
            const agendaClass = (a) =>
                classNames('agenda', `agenda-${a.code}`, {
                    [`additional-agenda-${standardiseCardSize(cardSize)}`]: a !== agenda
                });

            const retAgendas = [
                <div key={agenda.uuid} className={agendaClass(agenda)}>
                    {renderDroppablePile(
                        source,
                        <CardPile
                            cards={underneath}
                            disablePopup={disablePopup}
                            showCards={true}
                            source={source}
                            title={title}
                            topCard={agenda}
                            numColumns={5}
                            numRows={1.2}
                            {...cardPileProps}
                        />
                    )}
                </div>
            ];

            // Add all additional agendas separately (not as a CardPile)
            retAgendas.unshift(
                ...additionalAgendas.reverse().map((agenda) => {
                    return (
                        <div key={agenda.uuid} className={agendaClass(agenda)}>
                            <Card
                                card={agenda}
                                source={source}
                                disableHover={false}
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
        },
        [agendas, cardSize, renderDroppablePile, onCardClick, onMenuItemClick]
    );

    const cardPileProps = {
        onCardClick,
        onMenuItemClick,
        popupLocation: side,
        popupId: (sideNo ?? 1) === 1 ? side : `${side}-${sideNo}`, // Retain legacy top/bottom ids for first on each side
        size: cardSize,
        playerName
    };

    const getTitleCard = useCallback(() => {
        if (!title) {
            return null;
        }

        return (
            <Card
                card={title}
                source={'title'}
                disableHover={false}
                onClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                orientation='vertical'
                size={cardSize}
            />
        );
    }, [title, onCardClick, onMenuItemClick, cardSize]);

    const retHand = (
        <SquishableCardPanel
            cards={hand}
            groupVisibleCards
            maxCards={5}
            onCardClick={onCardClick}
            source='hand'
            title='Hand'
            cardSize={cardSize}
        />
    );
    const retDrawDeck = (
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
    const retDiscardPile = (
        <CardPile
            numColumns={5}
            numRows={2.2}
            className='discard'
            title='Discard'
            source='discard pile'
            cards={discardPile}
            {...cardPileProps}
        />
    );
    const retDeadPile = (
        <CardPile
            numColumns={5}
            numRows={2.2}
            className='dead'
            title='Dead'
            source='dead pile'
            cards={deadPile}
            orientation='horizontal'
            {...cardPileProps}
        />
    );
    const retShadows = (
        <SquishableCardPanel
            cards={shadows}
            cardSize={cardSize}
            maxCards={shadows.length === 0 ? 1 : 2}
            onCardClick={onCardClick}
            source='shadows'
            title='Shadows'
        />
    );
    const retOutOfGame = (
        <CardPile
            numColumns={4}
            numRows={1.2}
            cards={outOfGamePile}
            orientation='horizontal'
            source='out of game'
            title='Out of Game'
            size={cardSize}
            {...cardPileProps}
        />
    );
    const wrapperClassName = classNames('flex gap-2 m-1 w-fit', className);
    return (
        <div className={wrapperClassName}>
            <PlayerPlots
                cardSize={cardSize}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                direction={side === 'bottom' ? 'default' : 'reverse'}
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
                disablePopup
                onCardClick={onCardClick}
                size={cardSize}
                orientation={faction && faction.kneeled ? 'horizontal' : 'vertical'}
            />
            {getAgendas(cardPileProps)}
            {getTitleCard()}
            {renderDroppablePile('hand', retHand)}
            {shadows.length > 0 && renderDroppablePile('shadows', retShadows)}
            {renderDroppablePile('draw deck', retDrawDeck)}
            {renderDroppablePile('discard pile', retDiscardPile)}
            {renderDroppablePile('dead pile', retDeadPile)}
            {showHiddenPiles && shadows.length === 0 && renderDroppablePile('shadows', retShadows)}
            {(showHiddenPiles || outOfGamePile.length > 0) &&
                renderDroppablePile('out of game', retOutOfGame)}
        </div>
    );
};

export default PlayerRow;
