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
                        popupLocation={side}
                        showCards={true}
                        source={source}
                        title={title}
                        topCard={agenda}
                        size={cardSize}
                        numColumns={5}
                        numRows={1.2}
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
    }, [agendas, renderDroppablePile, onCardClick, onMenuItemClick, side, cardSize]);

    const getTitleCard = useCallback(() => {
        if (!title || !isMelee) {
            return null;
        }

        const titleCard = (
            <CardPile
                cards={[]}
                className='title'
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                popupLocation={side}
                source='title'
                title={title.name}
                topCard={title}
                size={cardSize}
            />
        );

        if (isMe) {
            return <Droppable source='title'>{titleCard}</Droppable>;
        }

        return titleCard;
    }, [title, isMelee, onCardClick, onMenuItemClick, side, cardSize, isMe]);

    const cardPileProps = {
        onCardClick: onCardClick,
        popupLocation: side,
        size: cardSize
    };

    const retHand = (
        <SquishableCardPanel
            cards={hand}
            groupVisibleCards
            username={username}
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
            username={username}
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

    return (
        <div className='flex gap-2 m-1 w-fit'>
            <PlayerPlots
                cardSize={cardSize}
                onCardClick={onCardClick}
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
                disablePopup
                onCardClick={onCardClick}
                size={cardSize}
                orientation={faction && faction.kneeled ? 'horizontal' : 'vertical'}
            />
            {getAgendas()}
            {getTitleCard()}
            {renderDroppablePile('hand', retHand)}
            {(showHiddenPiles || shadows.length > 0) && renderDroppablePile('shadows', retShadows)}
            {renderDroppablePile('draw deck', retDrawDeck)}
            {renderDroppablePile('discard pile', retDiscardPile)}
            {renderDroppablePile('dead pile', retDeadPile)}
            {(showHiddenPiles || outOfGamePile.length > 0) &&
                renderDroppablePile('out of game', retOutOfGame)}
        </div>
    );
};

export default PlayerRow;
