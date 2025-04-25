import React, { useCallback } from 'react';
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
import { useDispatch } from 'react-redux';
import PlayerStats from './PlayerStats';
import classNames from 'classnames';

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
                    className='lg:min-h-48'
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

            // Side panel must be treated differently for the 2 left-most boards, and for top/bottom
            const sidePanelClassName = classNames(
                'sticky left-0 flex flex-col p-1 pointer-events-none w-32 md:w-48 lg:w-64',
                {
                    'bottom-0 justify-end': side === 'bottom',
                    'top-0 justify-start': side === 'top'
                }
            );

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
                        <div className={sidePanelClassName}>
                            {!!player && <GameTimer player={player} isMe={isMe} side={side} />}
                            {isMe && (
                                <ActivePlayerPrompt
                                    className='pointer-events-auto'
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
                                    user={player.user}
                                    phase={thisPlayer.phase}
                                    // timerLimit={this.props.timerLimit}
                                    // timerStartTime={this.props.timerStartTime}
                                    // stopAbilityTimer={this.props.stopAbilityTimer}
                                />
                            )}
                        </div>
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
