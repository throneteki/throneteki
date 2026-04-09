import React, { useCallback, useMemo } from 'react';
import PlayerRow from '../PlayerRow';
import PlayerBoard from '../PlayerBoard';
import { sendShowDrawDeckMessage, sendShuffleDeckMessage } from '../../../redux/reducers/game';
import { useDispatch } from 'react-redux';
import PlayerStats from '../PlayerStats';
import classNames from 'classnames';
import SideBoardPanel from '../SideBoardPanel';
import { Button } from '@heroui/react';

const JoustGameBoardLayout = ({
    thisPlayer,
    otherPlayer,
    userPlayer,
    onCardClick,
    onMenuItemClick,
    onSettingsClick,
    onChatToggle,
    unreadMessages,
    isDragging,
    soloMode,
    soloActingPlayer,
    onSwitchSoloPerspective
}) => {
    const dispatch = useDispatch();

    const renderPlayerBoard = useCallback(
        (player, side) => {
            const isMe = soloMode ? true : thisPlayer && player === thisPlayer;

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
                            soloMode={soloMode}
                            soloActingPlayer={soloActingPlayer}
                            actingPlayerName={player.user?.username}
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
            soloMode,
            soloActingPlayer,
            dispatch
        ]
    );

    const switchSideLabel =
        soloActingPlayer === thisPlayer?.user?.username
            ? `Switch to ${otherPlayer?.name || 'Player 2'}`
            : `Switch to ${thisPlayer?.name || 'Player 1'}`;

    const switchTarget =
        soloActingPlayer === thisPlayer?.user?.username
            ? otherPlayer?.user?.username
            : thisPlayer?.user?.username;

    const gridStyle = useMemo(() => {
        if (!soloMode) {
            return { gridTemplateRows: 'repeat(2, 1fr)' };
        }

        const isThisPlayerActing = soloActingPlayer === thisPlayer?.user?.username;
        const isOtherPlayerActing = soloActingPlayer === otherPlayer?.user?.username;

        if (isThisPlayerActing) {
            return { gridTemplateRows: '2fr auto 3fr' };
        } else if (isOtherPlayerActing) {
            return { gridTemplateRows: '3fr auto 2fr' };
        }
        return { gridTemplateRows: '1fr auto 1fr' };
    }, [soloMode, soloActingPlayer, thisPlayer?.user?.username, otherPlayer?.user?.username]);

    return (
        <div
            className={classNames('min-h-full min-w-max grid grid-cols-1', {
                'transition-[grid-template-rows] duration-300 ease-in-out': soloMode
            })}
            style={gridStyle}
        >
            {renderPlayerBoard(otherPlayer, 'top')}
            {soloMode && (
                <div className='flex justify-center items-center py-1 bg-black/30'>
                    <Button
                        size='sm'
                        color='warning'
                        variant='flat'
                        onPress={() => onSwitchSoloPerspective && onSwitchSoloPerspective(switchTarget)}
                    >
                        {switchSideLabel}
                    </Button>
                </div>
            )}
            {renderPlayerBoard(thisPlayer, 'bottom')}
        </div>
    );
};

export default JoustGameBoardLayout;
