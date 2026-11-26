import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useRenderCount } from '../../../perf';

import Card from '../Card';
import CardPile from '../CardPile';
import SquishableCardPanel from '../SquishableCardPanel';
import DrawDeck from '../DrawDeck';
import Droppable from '../Droppable';
import PlayerPlots from '../PlayerPlots';
import AnimatedSlot from '../AnimatedSlot';
import { pileRise } from '../PileDepth';

const PlayerRow = ({
    className,
    outOfGamePile,
    onCardClick,
    side,
    sideNo,
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
    showHiddenPiles = false,
    setupPhase = false
}) => {
    useRenderCount('PlayerRow');
    const renderDroppablePile = useCallback(
        (source, cards, count) => {
            if (isMe) {
                return (
                    <Droppable
                        source={source}
                        className='self-start'
                        rise={count === undefined ? undefined : pileRise(count)}
                    >
                        {cards}
                    </Droppable>
                );
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
                    'card-additional-agenda': a !== agenda
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
                                orientation='vertical'
                            />
                        </div>
                    );
                })
            );
            return <div className='relative flex flex-row-reverse'>{retAgendas}</div>;
        },
        [agendas, renderDroppablePile, onCardClick]
    );

    const cardPileProps = {
        onCardClick,
        popupLocation: side,
        popupId: (sideNo ?? 1) === 1 ? side : `${side}-${sideNo}`, // Retain legacy top/bottom ids for first on each side
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
                orientation='vertical'
            />
        );
    }, [title, onCardClick]);

    const retHand = (
        <SquishableCardPanel
            cards={hand}
            groupVisibleCards
            maxCards={5}
            onCardClick={onCardClick}
            source='hand'
            title='Hand'
            flipFrom={playerName}
            stagedArrivals
            redeal={setupPhase}
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
            showDepth
            title='Discard'
            popupTitle='discard pile'
            source='discard pile'
            cards={discardPile}
            flipFrom={playerName}
            {...cardPileProps}
        />
    );
    const retDeadPile = (
        <CardPile
            numColumns={5}
            numRows={2.2}
            className='dead'
            showDepth
            title='Dead'
            popupTitle='dead pile'
            source='dead pile'
            cards={deadPile}
            orientation='horizontal'
            {...cardPileProps}
        />
    );
    const retShadows = (
        <SquishableCardPanel
            cards={shadows}
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
            title='Out of game'
            showDepth
            {...cardPileProps}
        />
    );
    const wrapperClassName = classNames('flex gap-2 m-1 w-fit', className);
    return (
        <div className={wrapperClassName}>
            <PlayerPlots
                onCardClick={onCardClick}
                direction={side === 'bottom' ? 'default' : 'reverse'}
                isMe={isMe}
                playerName={playerName}
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
                orientation={faction && faction.kneeled ? 'horizontal' : 'vertical'}
            />
            {getAgendas(cardPileProps)}
            {getTitleCard()}
            {renderDroppablePile('hand', retHand)}
            <AnimatedSlot open={showHiddenPiles || shadows.length > 0}>
                {renderDroppablePile('shadows', retShadows)}
            </AnimatedSlot>
            {renderDroppablePile('draw deck', retDrawDeck, numDrawCards || drawDeck?.length || 0)}
            {renderDroppablePile('discard pile', retDiscardPile, discardPile.length)}
            {renderDroppablePile('dead pile', retDeadPile, deadPile.length)}
            <AnimatedSlot open={showHiddenPiles || outOfGamePile.length > 0}>
                {renderDroppablePile('out of game', retOutOfGame, outOfGamePile.length)}
            </AnimatedSlot>
        </div>
    );
};

export default PlayerRow;
