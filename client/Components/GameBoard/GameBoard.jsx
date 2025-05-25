import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import LoadingSpinner from '../Site/LoadingSpinner';

import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import { navigate } from '../../redux/reducers/navigation';
import {
    sendCardClickedMessage,
    sendCardMenuItemClickedMessage,
    sendCardSizeChangeMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendToggleDupesMessage,
    sendToggleKeywordSettingMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleTimerSetting
} from '../../redux/reducers/game';

import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';
import CardImage from '../Images/CardImage';
import ErrorMessage from '../Site/ErrorMessage';
import JoustGameBoardLayout from './GameBoardLayouts/JoustGameBoardLayout';
import MeleeGameBoardLayout from './GameBoardLayouts/MeleeGameBoardLayout';

const placeholderPlayer = {
    activePlot: null,
    agendas: [],
    cardPiles: {
        cardsInPlay: [],
        deadPile: [],
        discardPile: [],
        hand: [],
        outOfGamePile: [],
        plotDeck: [],
        plotDiscard: [],
        shadows: []
    },
    faction: null,
    firstPlayer: false,
    numDrawCards: 0,
    selectedPlot: null,
    stats: null,
    user: null
};

const defaultPlayerInfo = (source) => {
    let player = Object.assign({}, placeholderPlayer, source);
    player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
    return player;
};

const GameBoard = () => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);

    const [showGameChat, setShowGameChat] = useState(window.innerWidth > 768);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [draggingDetail, setDraggingDetail] = useState(null);

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

    const onCardClick = useCallback(
        (card) => {
            //stopAbilityTimer();
            dispatch(sendCardClickedMessage(card.uuid));
        },
        [dispatch]
    );

    const onMenuItemClick = useCallback(
        (card, menuItem) => dispatch(sendCardMenuItemClickedMessage(card.uuid, menuItem)),
        [dispatch]
    );

    const thisPlayer = useMemo(
        () =>
            defaultPlayerInfo(
                currentGame?.players[user?.username] || Object.values(currentGame?.players)[0]
            ),
        [currentGame?.players, user?.username]
    );

    const otherPlayers = useMemo(() => {
        const others = Object.values(currentGame?.players).filter(
            (player) => player.name !== thisPlayer.name
        );
        return others.length > 0
            ? others.map(defaultPlayerInfo)
            : Array.from({ length: (currentGame?.maxPlayers || 2) - 1 }, (_, index) =>
                  defaultPlayerInfo({ seatNo: index + 2 })
              );
    }, [currentGame?.maxPlayers, currentGame?.players, thisPlayer.name]);

    if (!currentGame || !currentGame.started) {
        return <LoadingSpinner label={'Waiting for server...'} />;
    }

    if (!user) {
        dispatch(navigate('/'));
        return <LoadingSpinner label={'You are not logged in, redirecting...'} />;
    }

    if (!currentGame.players || currentGame.players.length === 0) {
        return <LoadingSpinner label={'Waiting for game to have players or close...'} />;
    }
    const boardClass = classNames('flex h-full overflow-x-hidden', {
        'cursor-select': thisPlayer && thisPlayer.selectCard
    });

    let gameBoard = null;
    if (currentGame.gameFormat === 'joust') {
        gameBoard = (
            <JoustGameBoardLayout
                thisPlayer={thisPlayer}
                otherPlayer={otherPlayers[0]}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onSettingsClick={() => setShowModal(!showModal)}
                onChatToggle={() => setShowGameChat(!showGameChat)}
                unreadMessages={unreadMessages}
                isDragging={!!draggingDetail}
            />
        );
    } else if (currentGame.gameFormat === 'melee') {
        gameBoard = (
            <MeleeGameBoardLayout
                thisPlayer={thisPlayer}
                otherPlayers={otherPlayers}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onSettingsClick={() => setShowModal(!showModal)}
                onChatToggle={() => setShowGameChat(!showGameChat)}
                unreadMessages={unreadMessages}
                isDragging={!!draggingDetail}
            />
        );
    } else {
        return (
            <ErrorMessage
                title={'Failed to load game board'}
                message={`Board for ${currentGame.gameFormat} format is not yet implemented`}
            />
        );
    }

    return (
        <>
            <div className={boardClass}>
                <div className='overflow-auto basis-[100%]'>
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
                        {gameBoard}
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
                </div>
                <GameChat
                    className='shrink-0 grow-0'
                    isOpen={showGameChat}
                    onClose={() => setShowGameChat(false)}
                    onUnreadMessagesChange={setUnreadMessages}
                    messages={currentGame.messages}
                    onSendChat={(message) => dispatch(sendGameChatMessage(message))}
                    muted={!thisPlayer && currentGame.muteSpectators}
                />
            </div>
            <GameConfigurationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                keywordSettings={thisPlayer.keywordSettings}
                onKeywordSettingToggle={(option, value) =>
                    dispatch(sendToggleKeywordSettingMessage(option, value))
                }
                onPromptDupesToggle={(value) => dispatch(sendToggleDupesMessage(value))}
                onPromptedActionWindowToggle={(option, value) =>
                    dispatch(sendTogglePromptedActionWindowMessage(option, value))
                }
                onTimerSettingToggle={(option, value) =>
                    dispatch(sendToggleTimerSetting(option, value))
                }
                onCardSizeSettingChange={(value) => dispatch(sendCardSizeChangeMessage(value))}
                promptDupes={thisPlayer.promptDupes}
                promptedActionWindows={thisPlayer.promptedActionWindows}
                timerSettings={thisPlayer.timerSettings}
                cardSizeSetting={thisPlayer.cardSize}
            />
        </>
    );
};

export default GameBoard;
