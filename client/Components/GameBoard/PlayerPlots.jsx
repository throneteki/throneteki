import React, { useCallback } from 'react';
import classNames from 'classnames';

import CardPile from './CardPile';
import Droppable from './Droppable';

const PlayerPlots = ({
    plotDiscard,
    onCardClick,
    onDragDrop,
    onMenuItemClick,
    onCardMouseOut,
    onCardMouseOver,
    cardSize,
    isMe,
    activePlot,
    plotDeck,
    selectedPlot,
    mustShowPlotSelection,
    direction
}) => {
    const renderPlotPiles = useCallback(() => {
        let revealedPlots = (
            <CardPile
                key='activeplot'
                cards={plotDiscard}
                className='plot'
                onCardClick={onCardClick}
                onDragDrop={onDragDrop}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onCardMouseOut}
                onMouseOver={onCardMouseOver}
                orientation='horizontal'
                size={cardSize}
                source='revealed plots'
                popupLocation={isMe ? 'bottom' : 'top'}
                title='Used Plots'
                topCard={activePlot}
            />
        );

        let plotDeckElement = (
            <CardPile
                key='plots'
                cards={plotDeck}
                className={selectedPlot ? 'plot plot-selected' : 'plot'}
                closeOnClick={isMe}
                hiddenTopCard={!mustShowPlotSelection}
                disablePopup={!isMe}
                onDragDrop={onDragDrop}
                onCardClick={onCardClick}
                onMouseOut={onCardMouseOut}
                onMouseOver={onCardMouseOver}
                orientation='horizontal'
                source='plot deck'
                title='Plots'
                popupLocation={isMe ? 'bottom' : 'top'}
                topCard={
                    mustShowPlotSelection && !!selectedPlot
                        ? selectedPlot
                        : { facedown: true, kneeled: true }
                }
                size={cardSize}
            />
        );

        let piles = [
            isMe ? (
                <Droppable key='usedplots' onDragDrop={onDragDrop} source='revealed plots'>
                    {revealedPlots}
                </Droppable>
            ) : (
                revealedPlots
            ),
            isMe ? (
                <Droppable key='plotdeck' onDragDrop={onDragDrop} source='plot deck'>
                    {plotDeckElement}
                </Droppable>
            ) : (
                plotDeckElement
            )
        ];

        if (direction === 'reverse') {
            piles.reverse();
        }

        return piles;
    }, [
        plotDiscard,
        onCardClick,
        onDragDrop,
        onMenuItemClick,
        onCardMouseOut,
        onCardMouseOver,
        cardSize,
        isMe,
        activePlot,
        plotDeck,
        selectedPlot,
        mustShowPlotSelection,
        direction
    ]);

    let className = classNames('flex flex-1 justify-start flex-col', {
        'justify-end': direction === 'default'
    });

    return <div className={className}>{renderPlotPiles()}</div>;
};

export default PlayerPlots;
