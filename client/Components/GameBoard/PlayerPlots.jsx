import React, { useCallback } from 'react';

import CardPile from './CardPile';
import Droppable from './Droppable';
import { getCardDimensions } from '../../util';

const PlayerPlots = ({
    plotDiscard,
    onCardClick,
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
                cards={plotDiscard}
                className='plot'
                numColumns={4}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onMouseOut={onCardMouseOut}
                onMouseOver={onCardMouseOver}
                orientation='horizontal'
                size={cardSize}
                source='revealed plots'
                popupLocation={isMe ? 'bottom' : 'top'}
                title='Used Plots'
                titlePosition={direction === 'reverse' && !activePlot ? 'bottom left' : 'top left'}
                topCard={activePlot}
            />
        );

        let plotDeckElement = (
            <CardPile
                cards={plotDeck}
                className={selectedPlot ? 'plot plot-selected' : 'plot'}
                closeOnClick={isMe}
                hiddenTopCard={!mustShowPlotSelection}
                disablePopup={!isMe}
                numColumns={4}
                onCardClick={onCardClick}
                onMouseOut={onCardMouseOut}
                onMouseOver={onCardMouseOver}
                orientation='horizontal'
                source='plot deck'
                title='Plots'
                titlePosition={direction !== 'reverse' && activePlot ? 'bottom left' : 'top left'}
                popupLocation={isMe ? 'bottom' : 'top'}
                // TODO: Move this logic (for Bloodraven) into the plot popup (eg. when player is showing, opponent sees the card in plot popup)
                // topCard={
                //     mustShowPlotSelection && !!selectedPlot
                //         ? selectedPlot
                //         : { facedown: true, kneeled: true }
                // }
                size={cardSize}
            />
        );

        let piles = [
            <div key='plotdeck' className={direction !== 'reverse' && 'absolute bottom-0'}>
                {isMe ? (
                    <Droppable source='plot deck'>{plotDeckElement}</Droppable>
                ) : (
                    plotDeckElement
                )}
            </div>,
            <div key='usedplots' className={direction === 'reverse' && 'absolute bottom-0'}>
                {isMe ? (
                    <Droppable source='revealed plots'>{revealedPlots}</Droppable>
                ) : (
                    revealedPlots
                )}
            </div>
        ];

        return piles;
    }, [
        plotDiscard,
        onCardClick,
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

    const height = getCardDimensions(cardSize).height;

    return (
        <div className={'relative flex flex-col'} style={{ height }}>
            {renderPlotPiles()}
        </div>
    );
};

export default PlayerPlots;
