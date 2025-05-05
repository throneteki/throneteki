import React, { useCallback, useMemo } from 'react';
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

const MeleeGameBoardLayout = ({
    thisPlayer,
    otherPlayers,
    onCardClick,
    onSettingsClick,
    onChatToggle,
    unreadMessages,
    isDragging
}) => {
    const dispatch = useDispatch();

    const renderPlayerBoard = useCallback(
        (player, side, hasSidePanel) => {
            const isMe = thisPlayer && player === thisPlayer;
            const isActivePrompt = player.isActivePrompt;

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
                'flex-col-reverse': side === 'bottom',
                'bg-blue-300/5': isActivePrompt
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
                        seatNo={player.seatNo} // Melee only
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
                            collapsable={!hasSidePanel}
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

    // Since rendering must be in top/bottom groups (with bottom first), we must arrange
    // in seat order, then rotate boards around to ensure thisPlayer is in the bottom left
    const players = useMemo(() => {
        const playersInSeatOrder = [thisPlayer, ...otherPlayers].sort(
            (a, b) => a.seatNo - b.seatNo
        );
        // Rotate so thisPlayer is first index
        while (playersInSeatOrder[0].seatNo !== thisPlayer.seatNo) {
            playersInSeatOrder.push(playersInSeatOrder.shift());
        }
        const numPlayers = playersInSeatOrder.length;
        const ordered = [];
        for (let i = 0; i < numPlayers; i++) {
            if (i === 0 || i % 2 === 1) {
                ordered.push(playersInSeatOrder.shift());
            } else {
                ordered.push(playersInSeatOrder.pop());
            }
        }
        return ordered;
    }, [otherPlayers, thisPlayer]);

    const remaining = [...players];
    const playerBoardGrid = [];
    const isOddPlayers = players.length % 2 !== 0;
    for (let column = 0; column < Math.floor(players.length / 2); column++) {
        const bottom = remaining.shift();
        // If we have an odd number of players, we ensure thisPlayer's board will span the width of
        // the first 2 above them, with remaining players rendered normally
        const top = column === 0 && isOddPlayers ? remaining.splice(0, 2) : remaining.shift();

        playerBoardGrid.push(
            <div key={column} className='flex flex-col flex-grow'>
                {Array.isArray(top) ? (
                    <div className='flex flex-grow'>
                        {top.map((player, index) =>
                            renderPlayerBoard(player, 'top', index === 0 && column === 0)
                        )}
                    </div>
                ) : (
                    renderPlayerBoard(top, 'top', column === 0)
                )}
                {renderPlayerBoard(bottom, 'bottom', column === 0)}
            </div>
        );
    }

    return <div className='flex h-full'>{playerBoardGrid}</div>;
};

export default MeleeGameBoardLayout;
