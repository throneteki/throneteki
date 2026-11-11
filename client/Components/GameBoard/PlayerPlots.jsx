import React, { useCallback } from 'react';

import CardPile from './CardPile';
import Droppable from './Droppable';
import classNames from 'classnames';

// The two piles overlap, so the one behind shows a strip of its top or bottom edge
const plotOverlap = 'calc(var(--card-scale, 1) * -2.6rem)';

const plotHeight = 'calc(var(--card-scale, 1) * 4rem)';
const plotAreaHeight = 'calc(var(--card-scale, 1) * 5.4rem)';

const PlayerPlots = ({
    plotDiscard,
    onCardClick,
    onMenuItemClick,
    isMe,
    activePlot,
    plotDeck,
    selectedPlot,
    mustShowPlotSelection,
    direction,
    playerName
}) => {
    const renderPlotPiles = useCallback(() => {
        const showSelectedPlot = mustShowPlotSelection && !!selectedPlot;
        const plotsInFront = showSelectedPlot || !activePlot;
        const deckAtBottom = direction !== 'reverse';
        const frontIsDeck = plotsInFront;

        const revealedPlots = (
            <CardPile
                cards={plotDiscard}
                className={'plot'}
                numColumns={4}
                numRows={2.2}
                onCardClick={onCardClick}
                orientation='horizontal'
                style={{ height: plotHeight }}
                source='revealed plots'
                popupLocation={isMe ? 'bottom' : 'top'}
                title='Used Plots'
                titlePosition={!deckAtBottom && frontIsDeck ? 'bottom left' : 'top left'}
                topCard={activePlot}
                disableBackground={true}
                flipFrom={`plots:${playerName}`}
            />
        );

        const plotDeckElement = (
            <CardPile
                cards={plotDeck}
                className={classNames('plot', {
                    'plot-selected': selectedPlot
                })}
                closeOnClick={isMe}
                hiddenTopCard={!showSelectedPlot}
                hideUnderCard
                disablePopup={!isMe}
                numColumns={4}
                numRows={2.2}
                onCardClick={onCardClick}
                orientation='horizontal'
                style={{ height: plotHeight }}
                source='plot deck'
                title='Plots'
                titlePosition={deckAtBottom && !frontIsDeck ? 'bottom left' : 'top left'}
                popupLocation={isMe ? 'bottom' : 'top'}
                topCard={showSelectedPlot ? selectedPlot : null}
                disableBackground={true}
                selected={!!selectedPlot}
                flipDeck={`plots:${playerName}`}
            />
        );

        const placed = (key, element, atBottom, inFront, className) => (
            <div
                key={key}
                className={classNames('relative rounded-md', className)}
                style={{
                    zIndex: inFront ? 1 : 0,
                    height: plotHeight,
                    marginTop: atBottom ? plotOverlap : undefined
                }}
            >
                {element}
            </div>
        );
        const deck = placed(
            'plotdeck',
            isMe ? <Droppable source='plot deck'>{plotDeckElement}</Droppable> : plotDeckElement,
            deckAtBottom,
            frontIsDeck
        );
        const used = placed(
            'usedplots',
            isMe ? <Droppable source='revealed plots'>{revealedPlots}</Droppable> : revealedPlots,
            !deckAtBottom,
            !frontIsDeck,
            activePlot ? 'shadow-[0_0_5px_0] shadow-black' : undefined
        );

        return deckAtBottom ? [used, deck] : [deck, used];
    }, [
        plotDiscard,
        onCardClick,
        onMenuItemClick,
        isMe,
        activePlot,
        plotDeck,
        selectedPlot,
        mustShowPlotSelection,
        direction,
        playerName
    ]);

    return (
        <div className='relative flex flex-col self-start' style={{ height: plotAreaHeight }}>
            <div className='inner-border absolute border-2 border-default-100/55 bg-black/55 w-full h-full rounded-md' />
            {renderPlotPiles()}
        </div>
    );
};

export default PlayerPlots;
