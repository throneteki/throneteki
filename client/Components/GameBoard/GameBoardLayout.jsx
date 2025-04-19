import React, { useState } from 'react';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import PlayerBoard from './PlayerBoard';
import GameTimer from './GameTimer';
import Droppable from './Droppable';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendButtonClickedMessage,
    sendCardMenuItemClickedMessage,
    sendDragDropMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage
} from '../../redux/reducers/game';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';
import CardImage from '../Images/CardImage';

const GameBoardLayout = ({ thisPlayer, otherPlayer, onCardClick }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const [draggingDetail, setDraggingDetail] = useState(null);
    const dispatch = useDispatch();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10
        }
    });

    // TODO: Create a custom touch sensor to allow for distance, delay & tolerance to work together (as TouchSensor does not support all 3 used together)
    // Distance is required to ensure press + hold shows the card hover
    // Delay is required to ensure a swipe gesture will scroll, such as scrolling down the draw deck window
    // Tolerance is a nice-to-have, but can probably be 0
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            distance: 10
        }
    });

    return (
        <DndContext
            sensors={[mouseSensor, touchSensor]}
            onDragStart={(event) => {
                const card = event.active.data.current?.card;
                if (card) {
                    const orientation = event.active.data.current?.orientation;
                    setDraggingDetail({ card, orientation });
                }
            }}
            onDragEnd={(event) => {
                if (!event.over || event.active.data.current.type !== ItemTypes.CARD) {
                    return;
                }
                setDraggingDetail(null);
                dispatch(
                    sendDragDropMessage(
                        event.active.data.current.card.uuid,
                        event.active.data.current.source,
                        event.over.data.current.source
                    )
                );
            }}
        >
            <div className={'flex flex-grow flex-col min-w-max'}>
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
                    outOfGamePile={otherPlayer.cardPiles.outOfGamePile}
                    username={user.username}
                    revealTopCard={otherPlayer.revealTopCard}
                    shadows={otherPlayer.cardPiles.shadows}
                    spectating={!thisPlayer}
                    title={otherPlayer.title}
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
                    isMelee={currentGame.isMelee}
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
                    showHiddenPiles={!!draggingDetail}
                />
            </div>
            <DragOverlay className={'opacity-50'} dropAnimation={null}>
                {draggingDetail && (
                    <CardImage
                        size={thisPlayer.cardSize}
                        code={draggingDetail.card.code || 'cardback'}
                        orientation={
                            (draggingDetail.card.type !== 'plot' &&
                                draggingDetail.orientation === 'horizontal') ||
                            draggingDetail.card.kneeled
                                ? 'rotated'
                                : draggingDetail.orientation
                        }
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default GameBoardLayout;
