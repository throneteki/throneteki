import { createPortal } from 'react-dom';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import LoadingSpinner from '../Site/LoadingSpinner';

import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { isShortcutEvent, keyboardShortcutsEnabled } from './keyboardShortcuts';
import { navigate } from '../../redux/reducers/navigation';
import {
    sendCardClickedMessage,
    sendCardMenuItemClickedMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendToggleDupesMessage,
    sendToggleKeywordSettingMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleHideResponsesMessage
} from '../../redux/reducers/game';

import {
    DndContext,
    MouseSensor,
    TouchSensor,
    pointerWithin,
    rectIntersection,
    useSensor
} from '@dnd-kit/core';
import CardImage from '../Images/CardImage';
import CarriedCard from './CarriedCard';
import ErrorMessage from '../Site/ErrorMessage';
import JoustGameBoardLayout from './GameBoardLayouts/JoustGameBoardLayout';
import MeleeGameBoardLayout from './GameBoardLayouts/MeleeGameBoardLayout';
import { ManualModeContext } from './ManualModeContext';
import { useRenderCount } from '../../perf';
import { useHudScale } from './useHudScale';
import { hudStore, useHud } from '../../hudStore';
import { MotionConfig } from 'framer-motion';
import { useMotionEnabled } from '../../motion';
import { holdFlip, playPendingFlip } from '../../flip';
import { dragStore, useDragGhost, useDragVersion } from './dragStore';
import { useLinger } from './useLinger';
import DropZoneTracker from './DropZoneTracker';
import { canDrop, needsChoice } from './dropTargets';
import { useImagePreload } from './useImagePreload';

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

const isRotated = (card, orientation) =>
    (card.type !== 'plot' && orientation === 'horizontal') || !!card.kneeled;

// The area under the pointer decides where the card is, falling back to the area the card overlaps
const detectCollisions = (args) => {
    const underPointer = pointerWithin(args);
    return underPointer.length > 0 ? underPointer : rectIntersection(args);
};

// The hidden drop zones that appear when a drag starts shift the board; keep the carried card with the pointer instead of scrolling to compensate
const autoScrollOptions = { layoutShiftCompensation: false };

const dropZoneLinger = 800;

const GameBoard = () => {
    useRenderCount('GameBoard');
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [showGameChat, setShowGameChat] = useState(window.innerWidth > 768);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const chatInputRef = useRef(null);
    const shortcutsEnabled = keyboardShortcutsEnabled(user?.settings);

    useEffect(() => {
        if (!shortcutsEnabled) {
            return;
        }

        const onKeyDown = (event) => {
            if (!isShortcutEvent(event)) {
                return;
            }

            if (event.key === 'Enter') {
                const input = chatInputRef.current;
                if (!input || input.disabled) {
                    return;
                }

                event.preventDefault();
                setShowGameChat(true);
                input.focus({ preventScroll: true });
            } else if (event.key === '?') {
                event.preventDefault();
                setShowShortcuts(true);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [shortcutsEnabled]);

    const [draggingDetail, setDraggingDetail] = useState(null);
    const draggedRef = useRef(null);
    const carriedRectRef = useRef(null);
    const dragGhost = useDragGhost();
    const dragVersion = useDragVersion();
    const boardAreaRef = useRef(null);
    // The extra drop zones stay until a dropped card has landed, so nothing moves under its flight
    const showDropZones = useLinger(!!draggingDetail || !!dragGhost, dropZoneLinger);

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
    const sensors = useMemo(() => [mouseSensor, touchSensor], [mouseSensor, touchSensor]);

    const onSettingsClick = useCallback(() => setShowModal((show) => !show), []);
    const onChatToggle = useCallback(() => setShowGameChat((show) => !show), []);
    const onChatClose = useCallback(() => setShowGameChat(false), []);
    const onSendChat = useCallback((message) => dispatch(sendGameChatMessage(message)), [dispatch]);
    const onModalClose = useCallback(() => setShowModal(false), []);

    const onDragStart = useCallback((event) => {
        const data = event.active.data.current;
        if (!data?.card) {
            return;
        }

        const pointer = event.activatorEvent.touches?.[0] ?? event.activatorEvent;
        const surface = event.activatorEvent.target?.closest?.('[data-card-surface]');
        const rect =
            (surface || event.active.rect.current.initial).getBoundingClientRect?.() ??
            event.active.rect.current.initial;
        const start = { x: pointer.clientX, y: pointer.clientY };
        draggedRef.current = {
            under:
                event.activatorEvent.target?.closest?.('[data-flip]')?.dataset.flipUnder !==
                undefined,
            card: data.card,
            orientation: data.orientation,
            source: data.source,
            start,
            grab: {
                x: start.x - rect.left,
                y: start.y - rect.top,
                width: rect.width,
                height: rect.height
            }
        };
        setDraggingDetail(draggedRef.current);
        dragStore.start(data.card.uuid, data.source, data.card.type);
        document.documentElement.classList.add('card-dragging');
    }, []);

    const onDragOver = useCallback(
        (event) => dragStore.setOver(event.over?.data.current?.source ?? null),
        []
    );

    const finishCarrying = useCallback(() => {
        const detail = draggedRef.current;
        const carried = carriedRectRef.current;
        carriedRectRef.current = null;
        draggedRef.current = null;
        setDraggingDetail(null);
        document.documentElement.classList.remove('card-dragging');

        if (!detail) {
            return {};
        }

        const rect = carried && { ...carried };
        const rotated = isRotated(detail.card, detail.orientation);
        return {
            detail,
            rect,
            rotated,
            origin: rect && {
                rect,
                source: detail.source,
                rot: rotated ? 90 : 0,
                under: detail.under,
                faceNode: document.querySelector('[data-carried] [data-card-face]')?.cloneNode(true)
            }
        };
    }, []);

    const onDragEnd = useCallback(
        (event) => {
            const { detail, rect, rotated, origin } = finishCarrying(event);
            if (!detail) {
                return;
            }

            const target = event.over?.data.current?.source;
            if (
                !rect ||
                !target ||
                (target === detail.source &&
                    !needsChoice(detail.source, target, detail.card.type)) ||
                !canDrop(detail.source, target, detail.card.type)
            ) {
                dragStore.settle(origin);
                return;
            }

            if (needsChoice(detail.source, target, detail.card.type)) {
                dispatch(sendDragDropMessage(detail.card.uuid, detail.source, target));
                dragStore.settle(origin);
                return;
            }

            dragStore.drop(
                {
                    uuid: detail.card.uuid,
                    code: detail.card.code || 'cardback',
                    orientation: rotated ? 'rotated' : detail.orientation,
                    rect,
                    target
                },
                origin
            );
            dispatch(sendDragDropMessage(detail.card.uuid, detail.source, target));
        },
        [dispatch, finishCarrying]
    );

    const onDragCancel = useCallback(
        (event) => {
            const { origin } = finishCarrying(event);
            dragStore.settle(origin);
        },
        [finishCarrying]
    );

    const onCardClick = useCallback(
        (card) => {
            dispatch(sendCardClickedMessage(card.uuid));
        },
        [dispatch]
    );

    const { thisPlayer, otherPlayers, userPlayer } = useMemo(() => {
        const players = Object.values(currentGame?.players);
        const thisPlayer = defaultPlayerInfo(currentGame?.players[user?.username] || players[0]);
        const others = players.filter((player) => player.name !== thisPlayer.name);
        // Fill with fake players if there are no others
        const otherPlayers =
            others.length > 0
                ? others.map(defaultPlayerInfo)
                : Array.from(
                      { length: Math.max((currentGame?.maxPlayers || 2) - 1, 1) },
                      (_, index) => defaultPlayerInfo({ seatNo: index + 2 })
                  );

        const allPlayers = players.concat(currentGame?.spectators);
        const userPlayer = allPlayers.find((p) => p.name === user?.username);
        return { thisPlayer, otherPlayers, userPlayer };
    }, [currentGame?.maxPlayers, currentGame?.players, currentGame?.spectators, user?.username]);

    const hud = useHud();
    useHudScale(hud, boardAreaRef, !!currentGame?.started);
    const motionEnabled = useMotionEnabled();
    const boardStarted = !!currentGame?.started;
    useLayoutEffect(() => {
        if (boardStarted) {
            holdFlip(1500);
        }
    }, [boardStarted]);
    useLayoutEffect(() => {
        if (dragStore.hasGhost()) {
            dragStore.finish();
            return;
        }
        playPendingFlip();
    }, [currentGame?.players]);
    useLayoutEffect(() => {
        playPendingFlip();
    }, [dragVersion]);
    useLayoutEffect(() => {
        document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
        return () => delete document.documentElement.dataset.motion;
    }, [motionEnabled]);
    useImagePreload(currentGame?.players);

    if (!currentGame || !currentGame.started) {
        return <LoadingSpinner label={'Waiting for server...'} />;
    }

    if (!user && token) {
        return <LoadingSpinner label={'Loading your account...'} />;
    }

    if (!user) {
        dispatch(navigate('/'));
        return <LoadingSpinner label={'You are not logged in, redirecting...'} />;
    }

    if (!currentGame.players || currentGame.players.length === 0) {
        return <LoadingSpinner label={'Waiting for game to have players or close...'} />;
    }

    const boardClass = classNames('flex h-full overflow-x-hidden hud-text', {
        'cursor-select': thisPlayer && thisPlayer.selectCard
    });

    let gameBoard = null;
    if (currentGame.gameFormat === 'joust') {
        gameBoard = (
            <JoustGameBoardLayout
                thisPlayer={thisPlayer}
                otherPlayer={otherPlayers[0]}
                userPlayer={userPlayer}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onSettingsClick={onSettingsClick}
                onChatToggle={onChatToggle}
                unreadMessages={unreadMessages}
                isDragging={showDropZones}
            />
        );
    } else if (currentGame.gameFormat === 'melee') {
        gameBoard = (
            <MeleeGameBoardLayout
                thisPlayer={thisPlayer}
                otherPlayers={otherPlayers}
                userPlayer={userPlayer}
                onCardClick={onCardClick}
                onMenuItemClick={onMenuItemClick}
                onSettingsClick={onSettingsClick}
                onChatToggle={onChatToggle}
                unreadMessages={unreadMessages}
                isDragging={showDropZones}
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
            <MotionConfig reducedMotion={motionEnabled ? 'user' : 'always'}>
                <div className={boardClass}>
                    <div
                        className='overflow-auto basis-full [scrollbar-gutter:stable]'
                        ref={boardAreaRef}
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={detectCollisions}
                            autoScroll={autoScrollOptions}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDragEnd={onDragEnd}
                            onDragCancel={onDragCancel}
                        >
                            <DropZoneTracker />
                            <ManualModeContext.Provider value={!!currentGame.manualMode}>
                                {gameBoard}
                            </ManualModeContext.Provider>
                            {draggingDetail && (
                                <CarriedCard
                                    key={draggingDetail.card.uuid}
                                    code={draggingDetail.card.code || 'cardback'}
                                    orientation={
                                        isRotated(draggingDetail.card, draggingDetail.orientation)
                                            ? 'rotated'
                                            : draggingDetail.orientation
                                    }
                                    start={draggingDetail.start}
                                    grab={draggingDetail.grab}
                                    rectRef={carriedRectRef}
                                />
                            )}
                        </DndContext>
                    </div>
                    <GameChat
                        className='shrink-0 grow-0'
                        isOpen={showGameChat}
                        onClose={onChatClose}
                        onUnreadMessagesChange={setUnreadMessages}
                        messages={currentGame.messages}
                        onSendChat={onSendChat}
                        muted={!thisPlayer && currentGame.muteSpectators}
                    />
                </div>
            </MotionConfig>
            {dragGhost &&
                createPortal(
                    <div
                        className='fixed z-[400] pointer-events-none'
                        style={{ left: dragGhost.rect.left, top: dragGhost.rect.top }}
                    >
                        <CardImage code={dragGhost.code} orientation={dragGhost.orientation} />
                    </div>,
                    document.querySelector('[data-overlay-container="true"]') || document.body
                )}
            <GameConfigurationModal
                isOpen={showModal}
                isSpectating={user.username !== thisPlayer.name}
                onClose={onModalClose}
                keywordSettings={userPlayer.keywordSettings}
                onKeywordSettingToggle={(option, value) =>
                    dispatch(sendToggleKeywordSettingMessage(option, value))
                }
                onPromptDupesToggle={(value) => dispatch(sendToggleDupesMessage(value))}
                onPromptedActionWindowToggle={(option, value) =>
                    dispatch(sendTogglePromptedActionWindowMessage(option, value))
                }
                onHideResponsesToggle={(option, value) =>
                    dispatch(sendToggleHideResponsesMessage(option, value))
                }
                onHudChange={hudStore.set.bind(hudStore)}
                promptDupes={userPlayer.promptDupes}
                promptedActionWindows={userPlayer.promptedActionWindows}
                hideInterrupts={userPlayer.hideInterrupts}
                hideReactions={userPlayer.hideReactions}
                hud={hud}
            />
            <KeyboardShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </>
    );
};

export default GameBoard;
