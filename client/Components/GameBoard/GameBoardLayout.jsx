import React from 'react';
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
import Plots from './Plots';

const GameBoardLayout = ({ thisPlayer, otherPlayer, onCardClick, onMouseOver, onMouseOut }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    return (
        <>
            <Plots
                thisPlayer={thisPlayer}
                otherPlayer={otherPlayer}
                onCardClick={onCardClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
            />
            <div className='flex w-full flex-shrink flex-grow flex-col overflow-x-hidden'>
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
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        outOfGamePile={otherPlayer.cardPiles.outOfGamePile}
                        username={user.username}
                        revealTopCard={otherPlayer.revealTopCard}
                        shadows={otherPlayer.cardPiles.shadows}
                        spectating={!thisPlayer}
                        title={otherPlayer.title}
                        side='top'
                        cardSize={user.settings.cardSize}
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
                                onMouseOver={onMouseOver}
                                onMouseOut={onMouseOut}
                                user={user}
                                phase={thisPlayer.phase}
                                // timerLimit={this.props.timerLimit}
                                // timerStartTime={this.props.timerStartTime}
                                // stopAbilityTimer={this.props.stopAbilityTimer}
                            />
                        </div>
                    </div>
                    <div className='play-area'>
                        <PlayerBoard
                            cardsInPlay={otherPlayer.cardPiles.cardsInPlay}
                            onCardClick={onCardClick}
                            onMenuItemClick={(card, menuItem) =>
                                dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                            }
                            onMouseOut={onMouseOut}
                            onMouseOver={onMouseOver}
                            rowDirection='reverse'
                            user={user}
                        />
                        <Droppable
                            onDragDrop={(card, source, target) =>
                                dispatch(sendDragDropMessage(card.uuid, source, target))
                            }
                            source='play area'
                        >
                            <PlayerBoard
                                cardsInPlay={thisPlayer.cardPiles.cardsInPlay}
                                onCardClick={onCardClick}
                                onMenuItemClick={(card, menuItem) =>
                                    dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem))
                                }
                                onMouseOut={onMouseOut}
                                onMouseOver={onMouseOver}
                                rowDirection='default'
                                user={user}
                            />
                        </Droppable>
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
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        numDrawCards={thisPlayer.numDrawCards}
                        onDrawPopupChange={(visible) => dispatch(sendShowDrawDeckMessage(visible))}
                        onShuffleClick={() => dispatch(sendShuffleDeckMessage())}
                        outOfGamePile={thisPlayer.cardPiles.outOfGamePile}
                        drawDeck={thisPlayer.cardPiles.drawDeck}
                        onDragDrop={(card, source, target) =>
                            dispatch(sendDragDropMessage(card.uuid, source, target))
                        }
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
                    />
                </div>
            </div>
        </>
    );
};

export default GameBoardLayout;
