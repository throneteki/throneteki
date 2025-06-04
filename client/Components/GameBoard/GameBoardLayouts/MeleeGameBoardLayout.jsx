import React, { useCallback, useMemo } from 'react';
import PlayerRow from '../PlayerRow';
import PlayerBoard from '../PlayerBoard';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';
import { useDispatch } from 'react-redux';
import PlayerStats from '../PlayerStats';
import classNames from 'classnames';
import SideBoardPanel from '../SideBoardPanel';

const MeleeGameBoardLayout = ({
    thisPlayer,
    otherPlayers,
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
        (player, side, sideNo, hasSidePanel) => {
            const isMe = thisPlayer && player === thisPlayer;
            const isActivePrompt = player.isActivePrompt;

            const wrapperClassName = classNames('flex flex-grow', {
                'flex-col': side === 'top',
                'flex-col-reverse': side === 'bottom',
                'bg-blue-300/5': isActivePrompt
            });

            return (
                <div key={`seat_${player.seatNo}`} className={wrapperClassName}>
                    <PlayerStats
                        className={isActivePrompt && 'bg-blue-300/15 border-blue-300/5'}
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
                        sideNo={sideNo}
                        cardSize={userPlayer.cardSize}
                        plotDeck={player.cardPiles.plotDeck}
                        plotDiscard={player.cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                        showHiddenPiles={isMe && isDragging}
                    />
                    <div className='relative flex flex-row-reverse flex-grow'>
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
            onMenuItemClick,
            onSettingsClick,
            thisPlayer,
            userPlayer,
            unreadMessages
        ]
    );

    // Grid is ordered top to bottom, left to right, ensuring that:
    // 1. Bottom left cell contains thisPlayer
    // 2. Other players are arranged in clockwise seating order, around thisPlayer
    // 3. If there is an odd number of players, thisPlayer will span the first two top opponents boards
    const playerBoardsGrid = useMemo(() => {
        // If there is somehow only one player, make sure they are rendered on the bottom, and skip the grid logic
        if (otherPlayers.length === 0) {
            return renderPlayerBoard(thisPlayer, 'bottom', true);
        }

        // Sort players in descending seat number, then rotate so thisPlayer is the 0th index
        const playersInSeatOrder = [thisPlayer, ...otherPlayers].sort(
            (a, b) => b.seatNo - a.seatNo
        );
        const thisIndex = playersInSeatOrder.findIndex((p) => p === thisPlayer);
        for (let i = 0; i < thisIndex; i++) {
            playersInSeatOrder.push(playersInSeatOrder.shift());
        }

        const isOdd = playersInSeatOrder.length % 2 !== 0;
        const gridCells = [];
        let ci = 0; // Cell Index
        let tc = 0; // Top Player Count
        let bc = 0; // Bottom Player Count

        while (playersInSeatOrder.length > 0) {
            if (ci % 2 !== 1) {
                // Top row
                const player = playersInSeatOrder.pop();

                if (isOdd && ci === 0) {
                    // If odd number of players, we need to ensure the first cell contains the
                    // first two players in top row, to ensure thisPlayer spans both their widths
                    const otherPlayer = playersInSeatOrder.pop();
                    gridCells.push(
                        <div
                            key={`seat_${player.seatNo}_${otherPlayer.seatNo}`}
                            className='flex flex-grow'
                        >
                            {renderPlayerBoard(player, 'top', ++tc, true)}
                            {renderPlayerBoard(otherPlayer, 'top', ++tc, false)}
                        </div>
                    );
                } else {
                    // Otherwise, just render the top player normally
                    gridCells.push(renderPlayerBoard(player, 'top', ++tc, ci < 2));
                }
            } else {
                // Bottom row
                gridCells.push(
                    renderPlayerBoard(playersInSeatOrder.shift(), 'bottom', ++bc, ci < 2)
                );
            }
            ci++;
        }
        return gridCells;
    }, [otherPlayers, thisPlayer, renderPlayerBoard]);

    return (
        <div className='min-h-full min-w-max grid grid-flow-col auto-cols-auto grid-rows-[repeat(2,auto)]'>
            {playerBoardsGrid}
        </div>
    );
};

export default MeleeGameBoardLayout;
