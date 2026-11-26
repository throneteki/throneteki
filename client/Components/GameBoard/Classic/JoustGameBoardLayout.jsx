import React, { useCallback } from 'react';
import PlayerRow from './PlayerRow';
import PlayerBoard from '../PlayerBoard';
import { findPendingAttachment, withoutPendingAttachment } from '../pendingAttachment';
import { findLeftBehind } from '../leftBehind';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';
import { useDispatch } from 'react-redux';
import PlayerStats from './PlayerStats';
import classNames from 'classnames';
import SideBoardPanel from './SideBoardPanel';

const JoustGameBoardLayout = ({
    thisPlayer,
    otherPlayer,
    userPlayer,
    onCardClick,
    onSettingsClick,
    isDragging
}) => {
    const dispatch = useDispatch();

    const renderPlayerBoard = useCallback(
        (player, side) => {
            const isMe = thisPlayer && player === thisPlayer;

            const wrapperClassName = classNames('flex grow', {
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
                    />
                    <PlayerRow
                        agendas={player.agendas}
                        faction={player.faction}
                        hand={withoutPendingAttachment(player.cardPiles.hand)}
                        setupPhase={player.phase === 'setup'}
                        isMe={isMe}
                        playerName={player.user?.username}
                        numDrawCards={player.numDrawCards}
                        onDrawPopupChange={
                            isMe
                                ? (visible) => dispatch(sendShowDrawDeckMessage(visible))
                                : undefined
                        }
                        onShuffleClick={isMe ? () => dispatch(sendShuffleDeckMessage()) : undefined}
                        discardPile={withoutPendingAttachment(player.cardPiles.discardPile)}
                        deadPile={withoutPendingAttachment(player.cardPiles.deadPile)}
                        drawDeck={withoutPendingAttachment(player.cardPiles.drawDeck)}
                        onCardClick={onCardClick}
                        outOfGamePile={withoutPendingAttachment(player.cardPiles.outOfGamePile)}
                        revealTopCard={player.revealTopCard}
                        shadows={withoutPendingAttachment(player.cardPiles.shadows)}
                        spectating={!thisPlayer}
                        title={player.title}
                        side={side}
                        plotDeck={player.cardPiles.plotDeck}
                        plotDiscard={player.cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                        showHiddenPiles={isMe && isDragging}
                    />
                    <div className='h-full relative flex flex-row-reverse grow'>
                        <PlayerBoard
                            isDroppable={isMe}
                            cardsInPlay={player.cardPiles.cardsInPlay}
                            pendingAttachment={findPendingAttachment(player.cardPiles)}
                            leftBehind={findLeftBehind(player.cardPiles)}
                            onCardClick={onCardClick}
                            rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                        />
                        <SideBoardPanel
                            player={player}
                            userPlayer={userPlayer}
                            isMe={isMe}
                            side={side}
                        />
                    </div>
                </div>
            );
        },
        [thisPlayer, userPlayer, onSettingsClick, onCardClick, isDragging, dispatch]
    );
    return (
        <div className='min-h-full min-w-max grid grid-cols-1 grid-rows-[repeat(2,1fr)]'>
            {renderPlayerBoard(otherPlayer, 'top')}
            {renderPlayerBoard(thisPlayer, 'bottom')}
        </div>
    );
};

export default JoustGameBoardLayout;
