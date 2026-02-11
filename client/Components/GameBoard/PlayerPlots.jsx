import React, { useCallback } from 'react';

import CardPile from './CardPile';
import Droppable from './Droppable';
import classNames from 'classnames';

const PlayerPlots = ({
    plotDiscard,
    onCardClick,
    onMenuItemClick,
    cardSize,
    isMe,
    activePlot,
    plotDeck,
    selectedPlot,
    mustShowPlotSelection,
    direction
}) => {
    const renderPlotPiles = useCallback(() => {
        const showSelectedPlot = mustShowPlotSelection && !!selectedPlot;
        const plotsInFront = showSelectedPlot || !activePlot;

        const revealedPlots = (
            <CardPile
                cards={plotDiscard}
                className={'plot'}
                numColumns={4}
                numRows={2.2}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                orientation='horizontal'
                size={cardSize}
                source='revealed plots'
                popupLocation={isMe ? 'bottom' : 'top'}
                title='Used Plots'
                titlePosition={direction === 'reverse' && plotsInFront ? 'bottom left' : 'top left'}
                topCard={activePlot}
                disableBackground={true}
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
                disablePopup={!isMe}
                numColumns={4}
                numRows={2.2}
                onCardClick={onCardClick}
                orientation='horizontal'
                source='plot deck'
                title='Plots'
                titlePosition={direction !== 'reverse' && activePlot ? 'bottom left' : 'top left'}
                popupLocation={isMe ? 'bottom' : 'top'}
                topCard={showSelectedPlot ? selectedPlot : null}
                size={cardSize}
                disableBackground={true}
                selected={!!selectedPlot}
            />
        );

        const plotClass = classNames('rounded-md', {
            'absolute bottom-0': direction !== 'reverse'
        });

        const usedClass = classNames('rounded-md', {
            'absolute bottom-0': direction === 'reverse',
            'shadow-[0_0_5px_0] shadow-black': !!activePlot
        });

        const piles = [
            <div key='plotdeck' className={plotClass}>
                {isMe ? (
                    <Droppable source='plot deck'>{plotDeckElement}</Droppable>
                ) : (
                    plotDeckElement
                )}
            </div>,
            <div key='usedplots' className={usedClass}>
                {isMe ? (
                    <Droppable source='revealed plots'>{revealedPlots}</Droppable>
                ) : (
                    revealedPlots
                )}
            </div>
        ];

        return plotsInFront ? piles.reverse() : piles;
    }, [
        plotDiscard,
        onCardClick,
        onMenuItemClick,
        cardSize,
        isMe,
        activePlot,
        plotDeck,
        selectedPlot,
        mustShowPlotSelection,
        direction
    ]);

    return (
        <div className='relative flex flex-col'>
            <div className=' inner-border absolute border-2 border-default-100/55 bg-black/55 w-full h-full rounded-md' />
            {renderPlotPiles()}
        </div>
    );
};

export default PlayerPlots;
