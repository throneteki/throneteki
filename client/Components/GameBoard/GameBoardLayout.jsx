import React, { useState } from 'react';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import PlayerBoard from './PlayerBoard';
import Droppable from './Droppable';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendButtonClickedMessage,
    sendCardMenuItemClickedMessage,
    sendDragDropMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage
} from '../../redux/reducers/game';
import { DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';

const GameBoardLayout = ({ thisPlayer, otherPlayer, onCardClick, onMouseOver, onMouseOut }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = useState(false);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10
        }
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5
        }
    });

    return (
        <DndContext
            sensors={[mouseSensor, touchSensor]}
            onDragStart={() => setIsDragging(true)}
            onDragCancel={() => setIsDragging(false)}
            onDragEnd={(event) => {
                setIsDragging(false);

                if (!event.over || event.active.data.current.type !== ItemTypes.CARD) {
                    return;
                }

                dispatch(
                    sendDragDropMessage(
                        event.active.data.current.card.uuid,
                        event.active.data.current.source,
                        event.over.data.current.source
                    )
                );
            }}
        >
            <div className='flex w-full flex-shrink flex-grow flex-col overflow-hidden'>
                <div className='flex overflow-hidden'>
                    <PlayerRow
                        agendas={otherPlayer.agendas}
                        faction={otherPlayer.faction}
                        hand={otherPlayer.cardPiles.hand}
                        isMe={false}
                        isMelee={currentGame.isMelee}
                        numDrawCards={otherPlayer.numDrawCards}
                        discardPile={otherPlayer.cardPiles.discardPile}
                        deadPile={otherPlayer.cardPiles.deadPile}
                        drawDeck={otherPlayer.cardPiles.drawDeck}
                        onCardClick={onCardClick}
                        onMouseOver={isDragging ? null : onMouseOver}
                        onMouseOut={onMouseOut}
                        outOfGamePile={otherPlayer.cardPiles.outOfGamePile}
                        username={user.username}
                        revealTopCard={otherPlayer.revealTopCard}
                        shadows={otherPlayer.cardPiles.shadows}
                        spectating={!thisPlayer}
                        title={otherPlayer.title}
                        side='top'
                        cardSize={user.settings.cardSize}
                        plotDeck={otherPlayer.cardPiles.plotDeck}
                        plotDiscard={otherPlayer.cardPiles.plotDiscard}
                        activePlot={otherPlayer.activePlot}
                        selectedPlot={otherPlayer.selectedPlot}
                        mustShowPlotSelection={otherPlayer.mustShowPlotSelection}
                    />
                </div>
                <div className='flex flex-grow flex-shrink min-h-0 overflow-x-hidden'>
                    <div className='flex flex-col justify-end'>
                        <div className='flex flex-col w-52 justify-between'>
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
                                onMouseOver={isDragging ? null : onMouseOver}
                                onMouseOut={onMouseOut}
                                user={user}
                                phase={thisPlayer.phase}
                                // timerLimit={this.props.timerLimit}
                                // timerStartTime={this.props.timerStartTime}
                                // stopAbilityTimer={this.props.stopAbilityTimer}
                            />
                        </div>
                    </div>
                    <div className='flex flex-1 flex-col m-2 overflow-x-auto'>
                        <PlayerBoard
                            cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                            onCardClick={onCardClick}
                            onMenuItemClick={(card, menuItem) =>
                                dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                            }
                            onMouseOut={onMouseOut}
                            onMouseOver={isDragging ? null : onMouseOver}
                            rowDirection='reverse'
                            user={user}
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
                                    onMouseOut={onMouseOut}
                                    onMouseOver={isDragging ? null : onMouseOver}
                                    rowDirection='default'
                                    user={user}
                                />
                            </Droppable>
                        </div>
                    </div>
                </div>
                <div className='player-home-row our-side'>
                    <PlayerRow
                        isMe={!!thisPlayer}
                        agendas={thisPlayer.agendas}
                        faction={thisPlayer.faction}
                        hand={thisPlayer.cardPiles.hand}
                        isMelee={currentGame.isMelee}
                        onCardClick={onCardClick}
                        onMouseOver={isDragging ? null : onMouseOver}
                        onMouseOut={onMouseOut}
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
                        cardSize={user.settings.cardSize}
                        side='bottom'
                        plotDeck={thisPlayer.cardPiles.plotDeck}
                        plotDiscard={thisPlayer.cardPiles.plotDiscard}
                        activePlot={thisPlayer.activePlot}
                        selectedPlot={thisPlayer.selectedPlot}
                    />
                </div>
            </div>
        </DndContext>
    );
};

export default GameBoardLayout;
