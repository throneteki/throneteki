import React, { useCallback } from 'react';
import PlayerRow from './PlayerRow';
import PlayerBoard from './PlayerBoard';
import Droppable from './Droppable';
import {
    sendCardMenuItemClickedMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage
} from '../../redux/reducers/game';
import { useDispatch } from 'react-redux';
import PlayerStats from './PlayerStats';
import classNames from 'classnames';
import SideBoardPanel from './SideBoardPanel';

const JoustGameBoardLayout = ({
    thisPlayer,
    otherPlayer,
    onCardClick,
    onSettingsClick,
    onChatToggle,
    unreadMessages,
    isDragging
}) => {
    const dispatch = useDispatch();

    const renderPlayerBoard = useCallback(
        (player, side) => {
            const isMe = thisPlayer && player === thisPlayer;

            const playerBoard = (
                <PlayerBoard
                    cardsInPlay={player.cardPiles.cardsInPlay}
                    onCardClick={onCardClick}
                    onMenuItemClick={(card, menuItem) =>
                        dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                    }
                    rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                    cardSize={thisPlayer.cardSize}
                />
            );

            const wrapperClassName = classNames('flex flex-grow', {
                'flex-col': side === 'top',
                'flex-col-reverse': side === 'bottom'
            });

            return (
                <div key={player.name} className={wrapperClassName}>
                    <PlayerStats
                        showControls={isMe}
                        stats={player.stats}
                        user={player.user}
                        firstPlayer={player.firstPlayer}
                        onSettingsClick={isMe ? onSettingsClick : undefined}
                        onChatToggle={isMe ? onChatToggle : undefined}
                        unreadMessages={isMe ? unreadMessages : undefined}
                    />
                    <PlayerRow
                        agendas={player.agendas}
                        faction={player.faction}
                        hand={player.cardPiles.hand}
                        isMe={isMe}
                        numDrawCards={player.numDrawCards}
                        onDrawPopupChange={
                            isMe
                                ? (visible) => dispatch(sendShowDrawDeckMessage(visible))
                                : undefined
                        }
                        onShuffleClick={isMe ? () => dispatch(sendShuffleDeckMessage()) : undefined}
                        discardPile={player.cardPiles.discardPile}
                        deadPile={player.cardPiles.deadPile}
                        drawDeck={player.cardPiles.drawDeck}
                        onCardClick={onCardClick}
                        outOfGamePile={player.cardPiles.outOfGamePile}
                        revealTopCard={player.revealTopCard}
                        shadows={player.cardPiles.shadows}
                        spectating={!thisPlayer}
                        title={player.title}
                        side={side}
                        cardSize={thisPlayer.cardSize}
                        plotDeck={player.cardPiles.plotDeck}
                        plotDiscard={player.cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                        showHiddenPiles={isMe && isDragging}
                    />
                    <div className='relative flex flex-row-reverse flex-grow'>
                        {isMe ? (
                            <Droppable source='play area' className='h-full flex flex-grow'>
                                {playerBoard}
                            </Droppable>
                        ) : (
                            playerBoard
                        )}
                        <SideBoardPanel
                            player={player}
                            thisPlayer={thisPlayer}
                            isMe={isMe}
                            side={side}
                        />
                    </div>
                </div>
            );
        },
        [
            dispatch,
            isDragging,
            onCardClick,
            onChatToggle,
            onSettingsClick,
            thisPlayer,
            unreadMessages
        ]
    );
    return (
        <div className='flex min-h-full'>
            <div className='flex flex-col flex-grow'>
                {renderPlayerBoard(otherPlayer, 'top')}
                {renderPlayerBoard(thisPlayer, 'bottom')}
            </div>
        </div>
    );
};

export default JoustGameBoardLayout;
