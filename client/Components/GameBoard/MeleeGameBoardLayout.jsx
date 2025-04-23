import React, { useMemo } from 'react';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import PlayerBoard from './PlayerBoard';
import GameTimer from './GameTimer';
import Droppable from './Droppable';
import {
    sendButtonClickedMessage,
    sendCardMenuItemClickedMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage
} from '../../redux/reducers/game';
import { useDispatch, useSelector } from 'react-redux';
import PlayerStats from './PlayerStats';
import classNames from 'classnames';

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
    const user = useSelector((state) => state.auth.user);

    // Since rendering must be in top/bottom groups (with bottom first), we must arrange
    // in seat order, then rotate boards around to ensure thisPlayer is in the bottom left
    const playersInRenderOrder = useMemo(() => {
        const playersInSeatOrder = [thisPlayer, ...otherPlayers].sort(
            (a, b) => a.seatNo - b.seatNo
        );
        const numPlayers = playersInSeatOrder.length;
        // Rotate so thisPlayer is first index
        while (playersInSeatOrder[0].seatNo !== thisPlayer.seatNo) {
            playersInSeatOrder.push(playersInSeatOrder.shift());
        }
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

    const playerBoards = playersInRenderOrder.map((player, index, players) => {
        const isMe = thisPlayer && player === thisPlayer;
        const side = index % 2 === 0 && index !== players.length - 1 ? 'bottom' : 'top';
        const isActivePrompt = player.isActivePrompt;
        const playerStats = (
            <PlayerStats
                showControls={isMe}
                stats={player.stats}
                user={player.user}
                firstPlayer={player.firstPlayer}
                onSettingsClick={isMe ? onSettingsClick : undefined}
                onChatToggle={isMe ? onChatToggle : undefined}
                unreadMessages={isMe ? unreadMessages : undefined}
                seatNo={player.seatNo}
            />
        );
        const playerRow = (
            <PlayerRow
                agendas={player.agendas}
                faction={player.faction}
                hand={player.cardPiles.hand}
                isMe={isMe}
                numDrawCards={player.numDrawCards}
                onDrawPopupChange={
                    isMe ? (visible) => dispatch(sendShowDrawDeckMessage(visible)) : undefined
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
        );
        // Left padding should match active prompt window widths
        const playerBoard = (
            <PlayerBoard
                className={classNames('min-h-48', { 'pl-32 md:pl-48 lg:pl-64': index == 1 })}
                cardsInPlay={player.cardPiles.cardsInPlay}
                onCardClick={onCardClick}
                onMenuItemClick={(card, menuItem) =>
                    dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                }
                rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                cardSize={thisPlayer.cardSize}
            />
        );

        const wrapperClassName = classNames('flex flex-grow max-h-[50%]', {
            'flex-col': side === 'top',
            'flex-col-reverse': side === 'bottom',
            'bg-blue-300/5': isActivePrompt
        });

        return (
            <div key={player.name} className={wrapperClassName}>
                {playerStats}
                {playerRow}
                <div className='relative flex flex-row-reverse flex-grow'>
                    {isMe ? (
                        <Droppable source='play area' className='h-full flex flex-grow'>
                            {playerBoard}
                        </Droppable>
                    ) : (
                        playerBoard
                    )}
                    {isMe && (
                        <div className='sticky left-0 bottom-0 self-end w-32 md:w-48 lg:w-64'>
                            <GameTimer thisPlayer={thisPlayer} otherPlayer={null}></GameTimer>
                            <ActivePlayerPrompt
                                buttons={thisPlayer.buttons}
                                controls={thisPlayer.controls}
                                promptText={thisPlayer.menuTitle}
                                promptTitle={thisPlayer.promptTitle}
                                onButtonClick={(button) =>
                                    dispatch(
                                        sendButtonClickedMessage(
                                            button.promptId,
                                            button.command,
                                            button.method,
                                            button.arg
                                        )
                                    )
                                }
                                user={user}
                                phase={thisPlayer.phase}
                                // timerLimit={this.props.timerLimit}
                                // timerStartTime={this.props.timerStartTime}
                                // stopAbilityTimer={this.props.stopAbilityTimer}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }, []);

    const playerBoardGroups = playerBoards.reduce((groups, player, index) => {
        if (index % 2 === 0) {
            groups.push([player]);
        } else {
            groups[groups.length - 1].push(player);
        }
        return groups;
    }, []);
    return (
        <div className='flex min-h-full'>
            {playerBoardGroups.map((group, index) => (
                <div
                    key={index}
                    className={classNames('flex', {
                        'flex-col-reverse': group.length > 1,
                        'flex-col': group.length === 1,
                        'w-full': index === playerBoardGroups.length - 1
                    })}
                >
                    {group}
                </div>
            ))}
        </div>
    );
};

export default MeleeGameBoardLayout;
