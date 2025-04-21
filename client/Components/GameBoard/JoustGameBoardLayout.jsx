import React from 'react';
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
    const user = useSelector((state) => state.auth.user);

    return (
        <div className='flex flex-col min-w-max h-full'>
            <PlayerStats
                showControls={false}
                stats={otherPlayer.stats}
                user={otherPlayer.user}
                firstPlayer={otherPlayer.firstPlayer}
            />
            <div className={'flex flex-grow flex-col min-w-max'}>
                <PlayerRow
                    agendas={otherPlayer.agendas}
                    faction={otherPlayer.faction}
                    hand={otherPlayer.cardPiles.hand}
                    isMe={false}
                    numDrawCards={otherPlayer.numDrawCards}
                    discardPile={otherPlayer.cardPiles.discardPile}
                    deadPile={otherPlayer.cardPiles.deadPile}
                    drawDeck={otherPlayer.cardPiles.drawDeck}
                    onCardClick={onCardClick}
                    outOfGamePile={otherPlayer.cardPiles.outOfGamePile}
                    username={user.username}
                    revealTopCard={otherPlayer.revealTopCard}
                    shadows={otherPlayer.cardPiles.shadows}
                    spectating={!thisPlayer}
                    side='top'
                    cardSize={thisPlayer.cardSize}
                    plotDeck={otherPlayer.cardPiles.plotDeck}
                    plotDiscard={otherPlayer.cardPiles.plotDiscard}
                    activePlot={otherPlayer.activePlot}
                    selectedPlot={otherPlayer.selectedPlot}
                    mustShowPlotSelection={otherPlayer.mustShowPlotSelection}
                />
                <div className='flex flex-grow'>
                    <div className='relative flex flex-col justify-end w-56'>
                        <GameTimer thisPlayer={thisPlayer} otherPlayer={otherPlayer}></GameTimer>
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
                    <div className='flex flex-1 flex-col m-2'>
                        <PlayerBoard
                            cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                            onCardClick={onCardClick}
                            onMenuItemClick={(card, menuItem) =>
                                dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                            }
                            rowDirection='reverse'
                            cardSize={thisPlayer.cardSize}
                        />
                        <div className='flex-1'>
                            <Droppable source='play area' className='h-full flex'>
                                <PlayerBoard
                                    cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                                    onCardClick={onCardClick}
                                    onMenuItemClick={(card, menuItem) =>
                                        dispatch(
                                            sendCardMenuItemClickedMessage(card.uuid, menuItem)
                                        )
                                    }
                                    rowDirection='default'
                                    cardSize={thisPlayer.cardSize}
                                />
                            </Droppable>
                        </div>
                    </div>
                </div>
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
    );
};

export default JoustGameBoardLayout;
