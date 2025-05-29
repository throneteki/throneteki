import React, { useCallback } from 'react';
import PlayerRow from '../PlayerRow';
import PlayerBoard from '../PlayerBoard';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';
import { useDispatch } from 'react-redux';
import PlayerStats from '../PlayerStats';
import classNames from 'classnames';
import SideBoardPanel from '../SideBoardPanel';

const JoustGameBoardLayout = ({
    thisPlayer,
    otherPlayer,
    userPlayer,
    onCardClick,
    onMenuItemClick,
    onSettingsClick,
    onChatToggle,
    unreadMessages,
    isDragging
}) => {
    const dispatch = useDispatch();

    const renderPlayerBoard = useCallback(
        (player, side) => {
            const isMe = thisPlayer && player === thisPlayer;

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
                        playerName={player.user?.username}
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
                        onMenuItemClick={onMenuItemClick}
                        outOfGamePile={player.cardPiles.outOfGamePile}
                        revealTopCard={player.revealTopCard}
                        shadows={player.cardPiles.shadows}
                        spectating={!thisPlayer}
                        title={player.title}
                        side={side}
                        cardSize={userPlayer.cardSize}
                        plotDeck={player.cardPiles.plotDeck}
                        plotDiscard={player.cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                        showHiddenPiles={isMe && isDragging}
                    />
                    <div className='h-full relative flex flex-row-reverse flex-grow'>
                        <PlayerBoard
                            isDroppable={isMe}
                            cardsInPlay={player.cardPiles.cardsInPlay}
                            onCardClick={onCardClick}
                            onMenuItemClick={onMenuItemClick}
                            rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                            cardSize={userPlayer.cardSize}
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
        [
            thisPlayer,
            userPlayer,
            onSettingsClick,
            onChatToggle,
            unreadMessages,
            onCardClick,
            onMenuItemClick,
            isDragging,
            dispatch
        ]
    );
    return (
        <div className='min-h-full min-w-max grid grid-cols-1 grid-rows-[repeat(2,auto)]'>
            {renderPlayerBoard(otherPlayer, 'top')}
            {renderPlayerBoard(thisPlayer, 'bottom')}
        </div>
    );
};

export default JoustGameBoardLayout;
