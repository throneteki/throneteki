import React from 'react';
import PlayerPlots from './PlayerPlots';
import GameTimer from './GameTimer';
import { useDispatch, useSelector } from 'react-redux';
import { sendCardMenuItemClickedMessage } from '../../redux/reducers/game';

const Plots = ({ thisPlayer, otherPlayer, onCardClick, onMouseOut, onMouseOver }) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    let commonProps = {
        cardSize: user.settings.cardSize,
        onCardClick: onCardClick,
        onCardMouseOut: onMouseOut,
        onCardMouseOver: onMouseOver,
        onMenuItemClick: (card, menuItem) =>
            dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <PlayerPlots
                {...commonProps}
                activePlot={otherPlayer.activePlot}
                direction='reverse'
                isMe={false}
                plotDeck={otherPlayer.cardPiles.plotDeck}
                plotDiscard={otherPlayer.cardPiles.plotDiscard}
                selectedPlot={otherPlayer.selectedPlot}
                mustShowPlotSelection={otherPlayer.mustShowPlotSelection}
            />
            <GameTimer thisPlayer={thisPlayer} otherPlayer={otherPlayer} />
            <PlayerPlots
                {...commonProps}
                activePlot={thisPlayer.activePlot}
                direction='default'
                isMe
                plotDeck={thisPlayer.cardPiles.plotDeck}
                plotDiscard={thisPlayer.cardPiles.plotDiscard}
                selectedPlot={thisPlayer.selectedPlot}
                mustShowPlotSelection={false}
            />
        </div>
    );
};

export default Plots;
