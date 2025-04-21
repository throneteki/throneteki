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
import { Divider } from '@heroui/react';

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

    const playersTopRow = useMemo(() => {
        const players = otherPlayers.filter(
            (player, index) => index === 0 || (index + 1) % 2 === 0
        );
        return players.map((player) => (
            <div key={player.name} className='flex flex-col h-full'>
                <PlayerStats
                    showControls={false}
                    stats={player.stats}
                    user={player.user}
                    firstPlayer={player.firstPlayer}
                />
                <div className='flex flex-grow flex-col px-5'>
                    <PlayerRow
                        agendas={player.agendas}
                        faction={player.faction}
                        hand={player.cardPiles.hand}
                        isMe={false}
                        numDrawCards={player.numDrawCards}
                        discardPile={player.cardPiles.discardPile}
                        deadPile={player.cardPiles.deadPile}
                        drawDeck={player.cardPiles.drawDeck}
                        onCardClick={onCardClick}
                        outOfGamePile={player.cardPiles.outOfGamePile}
                        username={user.username}
                        revealTopCard={player.revealTopCard}
                        shadows={player.cardPiles.shadows}
                        spectating={!thisPlayer}
                        title={player.title}
                        side='top'
                        cardSize={thisPlayer.cardSize}
                        plotDeck={player.cardPiles.plotDeck}
                        plotDiscard={player.cardPiles.plotDiscard}
                        activePlot={player.activePlot}
                        selectedPlot={player.selectedPlot}
                        mustShowPlotSelection={player.mustShowPlotSelection}
                    />
                    <div className='flex flex-grow'>
                        <div className='flex flex-1 flex-col m-2'>
                            <PlayerBoard
                                cardsInPlay={player.cardPiles.cardsInPlay}
                                onCardClick={onCardClick}
                                onMenuItemClick={(card, menuItem) =>
                                    dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                                }
                                rowDirection='reverse'
                                cardSize={thisPlayer.cardSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ));
    }, [dispatch, onCardClick, otherPlayers, thisPlayer, user.username]);

    const playersBottomRow = useMemo(() => {
        const players = [
            <div key={thisPlayer.name} className='flex flex-col h-full'>
                <div className='flex flex-grow flex-col px-5'>
                    <Droppable source='play area' className='h-full flex'>
                        <PlayerBoard
                            cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                            onCardClick={onCardClick}
                            onMenuItemClick={(card, menuItem) =>
                                dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                            }
                            rowDirection='default'
                            cardSize={thisPlayer.cardSize}
                        />
                    </Droppable>
                    <PlayerRow
                        isMe={!!thisPlayer}
                        agendas={thisPlayer.agendas}
                        faction={thisPlayer.faction}
                        hand={thisPlayer.cardPiles.hand}
                        onCardClick={onCardClick}
                        numDrawCards={thisPlayer.numDrawCards}
                        onDrawPopupChange={(visible) => dispatch(sendShowDrawDeckMessage(visible))}
                        onShuffleClick={() => dispatch(sendShuffleDeckMessage())}
                        outOfGamePile={thisPlayer.cardPiles.outOfGamePile}
                        drawDeck={thisPlayer.cardPiles.drawDeck}
                        discardPile={thisPlayer.cardPiles.discardPile}
                        deadPile={thisPlayer.cardPiles.deadPile}
                        revealTopCard={thisPlayer.revealTopCard}
                        shadows={thisPlayer.cardPiles.shadows}
                        showDeck={thisPlayer.showDeck}
                        spectating={!thisPlayer}
                        title={thisPlayer.title}
                        onMenuItemClick={(card, menuItem) =>
                            dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                        }
                        cardSize={thisPlayer.cardSize}
                        side='bottom'
                        plotDeck={thisPlayer.cardPiles.plotDeck}
                        plotDiscard={thisPlayer.cardPiles.plotDiscard}
                        activePlot={thisPlayer.activePlot}
                        selectedPlot={thisPlayer.selectedPlot}
                        showHiddenPiles={isDragging}
                    />
                </div>
                <PlayerStats
                    stats={thisPlayer.stats}
                    showControls={true}
                    showMessages
                    user={thisPlayer.user}
                    firstPlayer={thisPlayer.firstPlayer}
                    onSettingsClick={onSettingsClick}
                    onChatToggle={onChatToggle}
                    numMessages={unreadMessages}
                />
            </div>
        ];
        players.push(
            ...otherPlayers
                .filter((player, index) => index !== 0 && index % 2 === 0)
                .map((player) => (
                    <div key={player.name} className='flex flex-col h-full'>
                        <div className='flex flex-grow flex-col px-5'>
                            <PlayerBoard
                                cardsInPlay={player.cardPiles.cardsInPlay}
                                onCardClick={onCardClick}
                                onMenuItemClick={(card, menuItem) =>
                                    dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                                }
                                rowDirection='reverse'
                                cardSize={thisPlayer.cardSize}
                            />
                            <PlayerRow
                                agendas={player.agendas}
                                faction={player.faction}
                                hand={player.cardPiles.hand}
                                isMe={false}
                                numDrawCards={player.numDrawCards}
                                discardPile={player.cardPiles.discardPile}
                                deadPile={player.cardPiles.deadPile}
                                drawDeck={player.cardPiles.drawDeck}
                                onCardClick={onCardClick}
                                outOfGamePile={player.cardPiles.outOfGamePile}
                                username={user.username}
                                revealTopCard={player.revealTopCard}
                                shadows={player.cardPiles.shadows}
                                spectating={!thisPlayer}
                                title={player.title}
                                side='bottom'
                                cardSize={thisPlayer.cardSize}
                                plotDeck={player.cardPiles.plotDeck}
                                plotDiscard={player.cardPiles.plotDiscard}
                                activePlot={player.activePlot}
                                selectedPlot={player.selectedPlot}
                                mustShowPlotSelection={player.mustShowPlotSelection}
                            />
                        </div>
                        <PlayerStats
                            showControls={false}
                            stats={player.stats}
                            user={player.user}
                            firstPlayer={player.firstPlayer}
                        />
                    </div>
                ))
        );
        return players;
    }, [
        dispatch,
        isDragging,
        onCardClick,
        onChatToggle,
        onSettingsClick,
        otherPlayers,
        thisPlayer,
        unreadMessages,
        user.username
    ]);
    return (
        <div className='flex h-full'>
            <div className='relative flex flex-col justify-end'>
                {/* <GameTimer thisPlayer={thisPlayer} otherPlayer={otherPlayer}></GameTimer> */}
                <div className='flex flex-col justify-between'>
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
            </div>
            <div className='flex flex-col'>
                <div className='flex min-w-max flex-grow'>{playersTopRow}</div>
                <div className='flex min-w-max flex-grow'>{playersBottomRow}</div>
            </div>
        </div>
    );
};

export default MeleeGameBoardLayout;
