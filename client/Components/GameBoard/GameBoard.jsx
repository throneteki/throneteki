import { createPortal } from 'react-dom';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../Site/LoadingSpinner';

import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { isShortcutEvent, keyboardShortcutsEnabled } from './keyboardShortcuts';
import { navigate } from '../../redux/reducers/navigation';
import {
    sendCardClickedMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendToggleDupesMessage,
    sendToggleKeywordSettingMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleHideResponsesMessage
} from '../../redux/reducers/game';

import { DndContext, MouseSensor, pointerWithin, rectIntersection, useSensor } from '@dnd-kit/core';
import { HoldTouchSensor, holdToDrag } from './HoldTouchSensor';
import CardImage from '../Images/CardImage';
import CarriedCard from './CarriedCard';
import { cardScaleOf } from '../../cardScale';
import ErrorMessage from '../Site/ErrorMessage';
import JoustGameBoardLayout from './Classic/JoustGameBoardLayout';
import MeleeGameBoardLayout from './Classic/MeleeGameBoardLayout';
import AdaptiveGameBoardLayout from './Adaptive/AdaptiveGameBoardLayout';
import { BoardLayoutProvider, useBoardLayout } from './Adaptive/useBoardLayout';
import { useAdaptivePage } from './Adaptive/useAdaptivePage';
import { hidesNavbar } from '../../boardLayoutStore';
import { ManualModeContext } from './ManualModeContext';
import { useRenderCount } from '../../perf';
import { useHudScale } from './useHudScale';
import { useHud } from '../../hudStore';
import { MotionConfig } from 'framer-motion';
import { useMotionEnabled } from '../../motion';
import { holdFlip, playPendingFlip, setLandInPopup } from '../../flip';
import { dragStore, useDragGhost, useDragVersion } from './dragStore';
import { playShuffles } from '../../shuffle';
import { elevation } from '../../tableFeel';
import { forgetBoard, showBoard } from '../../counterMemory';
import { useLinger } from './useLinger';
import DropZoneTracker from './DropZoneTracker';
import { canDrop, canPlaceUnder, needsChoice } from './dropTargets';
import { cardInPlayAt, createUnderHold } from './underHold';

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

const areaOf = (collision) => {
    const rect = collision.data?.droppableContainer?.rect.current;
    return rect ? rect.width * rect.height : Infinity;
};

// The area under the pointer decides where the card is, falling back to the area the card overlaps. Where
// areas overlap (the top of a deep pile standing up into the board), the smallest one is the one meant.
const detectCollisions = (args) => {
    const underPointer = pointerWithin(args);
    return underPointer.length > 0
        ? underPointer.sort((a, b) => areaOf(a) - areaOf(b))
        : rectIntersection(args);
};

// The hidden drop zones that appear when a drag starts shift the board; keep the carried card with the pointer instead of scrolling to compensate
const autoScrollOptions = { layoutShiftCompensation: false };

const dropZoneLinger = 800;
const boardSettle = 1500;

// Plays the cards' moves when the drag store changes, without re-rendering the board
const FlipOnDragChange = () => {
    const dragVersion = useDragVersion();
    useLayoutEffect(() => {
        playPendingFlip();
    }, [dragVersion]);
    return null;
};

const GameBoard = () => {
    useRenderCount('GameBoard');
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [showGameChat, setShowGameChat] = useState(window.innerWidth > 768);
    const [showModal, setShowModal] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [chatUnread, setChatUnread] = useState(0);
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
    const boardAreaRef = useRef(null);
    // The extra drop zones stay until a dropped card has landed, so nothing moves under its flight
    const showDropZones = useLinger(!!draggingDetail || !!dragGhost, dropZoneLinger);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10
        }
    });

    const touchSensor = useSensor(HoldTouchSensor, { activationConstraint: holdToDrag });
    const sensors = useMemo(() => [mouseSensor, touchSensor], [mouseSensor, touchSensor]);

    const onSettingsClick = useCallback(() => setShowModal((show) => !show), []);
    const onChatToggle = useCallback(() => setShowGameChat((show) => !show), []);
    const onSendChat = useCallback((message) => dispatch(sendGameChatMessage(message)), [dispatch]);
    const onModalClose = useCallback(() => setShowModal(false), []);

    // Cards on the adaptive board are not all drawn at the board's card size
    const adaptiveRef = useRef(false);
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
            // The card is carried at the size it was picked up at, which a hand or pile may draw it at
            scale: adaptiveRef.current ? cardScaleOf(surface) : undefined,
            grab: {
                x: start.x - rect.left,
                y: start.y - rect.top,
                width: rect.width,
                height: rect.height
            }
        };
        setDraggingDetail(draggedRef.current);
        setLandInPopup(null);
        dragStore.start(data.card.uuid, data.source, data.card.type);
        document.documentElement.classList.add('card-dragging');
    }, []);

    // The cursor shows a refused drop over an area the card cannot go in, unless it is armed to go under a card there
    const overRef = useRef(null);
    const showDropCursor = useCallback(() => {
        const detail = draggedRef.current;
        const over = overRef.current;
        document.documentElement.classList.toggle(
            'card-drop-refused',
            !!detail &&
                !!over &&
                !dragStore.getUnder() &&
                over !== detail.source &&
                !canDrop(detail.source, over, detail.card.type)
        );
    }, []);

    const onDragOver = useCallback(
        (event) => {
            overRef.current = event.over?.data.current?.source ?? null;
            dragStore.setOver(overRef.current);
            showDropCursor();
        },
        [showDropCursor]
    );

    const underHold = useMemo(
        () =>
            createUnderHold({
                onArm: (uuid) => {
                    dragStore.setUnder(uuid);
                    showDropCursor();
                }
            }),
        [showDropCursor]
    );
    // Read from the pointer itself: dnd-kit's drag delta also counts the board scrolling under the card
    useEffect(() => {
        if (!draggingDetail) {
            return;
        }
        const onPointerMove = (event) => {
            const detail = draggedRef.current;
            if (!detail) {
                return;
            }
            const point = { x: event.clientX, y: event.clientY };
            underHold.track(
                point,
                canPlaceUnder(detail.source, detail.card.type)
                    ? cardInPlayAt(point, detail.card.uuid)
                    : null
            );
        };
        window.addEventListener('pointermove', onPointerMove);
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, [draggingDetail, underHold]);

    const finishCarrying = useCallback(() => {
        const detail = draggedRef.current;
        const carried = carriedRectRef.current;
        const under = dragStore.getUnder();
        underHold.reset();
        carriedRectRef.current = null;
        draggedRef.current = null;
        setDraggingDetail(null);
        document.documentElement.classList.remove('card-dragging', 'card-drop-refused');

        if (!detail) {
            return {};
        }

        const rect = carried && { ...carried };
        const rotated = isRotated(detail.card, detail.orientation);
        return {
            detail,
            rect,
            rotated,
            under,
            // Tucked under a card, it was already shown upright and face down where it goes
            origin: rect && {
                rect,
                source: detail.source,
                rot: rotated && !under ? 90 : 0,
                under: detail.under,
                faceNode:
                    under && rotated
                        ? undefined
                        : document
                              .querySelector(
                                  `[data-carried] [${under ? 'data-carried-back' : 'data-carried-face'}] [data-card-face]`
                              )
                              ?.cloneNode(true)
            }
        };
    }, [underHold]);

    const onDragEnd = useCallback(
        (event) => {
            const { detail, rect, rotated, under, origin } = finishCarrying(event);
            if (!detail) {
                return;
            }

            // Held over a card it goes under that card; dropped in the popup of a card's underneath cards, under that
            // card too, landing in the popup where it was dropped
            const overData = event.over?.data.current;
            const popupParent =
                overData?.source === 'underneath' &&
                canPlaceUnder(detail.source, detail.card.type) &&
                overData.parentUuid;
            const parent = under || popupParent;
            if (parent && rect) {
                setLandInPopup(under ? null : detail.card.uuid);
                dragStore.drop(
                    {
                        uuid: detail.card.uuid,
                        code: under ? 'cardback' : detail.card.code || 'cardback',
                        orientation: under ? 'vertical' : rotated ? 'rotated' : detail.orientation,
                        rect,
                        scale: under ? undefined : detail.scale,
                        target: 'underneath'
                    },
                    origin
                );
                dispatch(
                    sendDragDropMessage(detail.card.uuid, detail.source, 'underneath', parent)
                );
                return;
            }

            const target = overData?.source;
            const choice = needsChoice(detail.source, target, detail.card.type);
            if (
                !rect ||
                !target ||
                (target === detail.source && !choice) ||
                !canDrop(detail.source, target, detail.card.type)
            ) {
                dragStore.settle(origin);
                return;
            }

            if (choice) {
                dispatch(sendDragDropMessage(detail.card.uuid, detail.source, target));
                dragStore.settle(origin);
                return;
            }

            setLandInPopup(overData.popup ? detail.card.uuid : null);
            dragStore.drop(
                {
                    uuid: detail.card.uuid,
                    code: detail.card.code || 'cardback',
                    orientation: rotated ? 'rotated' : detail.orientation,
                    rect,
                    scale: detail.scale,
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

    const { players, thisPlayer, otherPlayers, userPlayer } = useMemo(() => {
        const players = Object.values(currentGame?.players || {});
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

        const userPlayer = players
            .concat(currentGame?.spectators)
            .find((p) => p.name === user?.username);
        return { players, thisPlayer, otherPlayers, userPlayer };
    }, [currentGame?.maxPlayers, currentGame?.players, currentGame?.spectators, user?.username]);

    const hud = useHud();
    const boardStarted = !!currentGame?.started;
    const adaptive = hud.board === 'adaptive';
    adaptiveRef.current = adaptive;
    useHudScale(hud, boardAreaRef, boardStarted && !adaptive);
    const layoutMode = useBoardLayout({
        containerRef: boardAreaRef,
        hud,
        players,
        ready: boardStarted && adaptive
    });
    useAdaptivePage(boardStarted && adaptive);
    // Laid out for a phone, the chat drops over the board, so it starts closed
    const phoneLayout = adaptive && hidesNavbar(layoutMode);
    useEffect(() => {
        if (phoneLayout) {
            setShowGameChat(false);
        }
    }, [phoneLayout]);
    const motionEnabled = useMotionEnabled();
    useLayoutEffect(() => {
        if (!boardStarted) {
            return;
        }
        holdFlip(boardSettle);
        // Counters drawn while the board is first filling in were already on the cards
        const timer = setTimeout(showBoard, boardSettle);
        return () => {
            clearTimeout(timer);
            forgetBoard();
        };
    }, [boardStarted]);
    useLayoutEffect(() => {
        if (dragStore.hasGhost()) {
            dragStore.finish();
            return;
        }
        playPendingFlip();
    }, [currentGame?.players]);
    useLayoutEffect(() => {
        playShuffles(currentGame?.players);
    }, [currentGame?.players]);
    useLayoutEffect(() => {
        document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
        return () => delete document.documentElement.dataset.motion;
    }, [motionEnabled]);

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

    const boardClass = 'relative flex h-full overflow-x-hidden hud-text';

    let gameBoard = null;
    if (adaptive) {
        gameBoard = (
            <BoardLayoutProvider value={layoutMode}>
                <AdaptiveGameBoardLayout
                    thisPlayer={thisPlayer}
                    otherPlayers={otherPlayers}
                    userPlayer={userPlayer}
                    onCardClick={onCardClick}
                    onSettingsClick={onSettingsClick}
                    onShortcutsClick={() => setShowShortcuts(true)}
                    chat={{ open: showGameChat, unread: chatUnread, onToggle: onChatToggle }}
                    isDragging={showDropZones}
                />
            </BoardLayoutProvider>
        );
    } else if (currentGame.gameFormat === 'joust') {
        gameBoard = (
            <JoustGameBoardLayout
                thisPlayer={thisPlayer}
                otherPlayer={otherPlayers[0]}
                userPlayer={userPlayer}
                onCardClick={onCardClick}
                onSettingsClick={onSettingsClick}
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
                onSettingsClick={onSettingsClick}
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
            <FlipOnDragChange />
            <MotionConfig reducedMotion={motionEnabled ? 'user' : 'always'}>
                <div className={boardClass}>
                    <div
                        className={
                            adaptive
                                ? 'overflow-hidden basis-full min-w-0'
                                : 'overflow-auto basis-full [scrollbar-gutter:stable]'
                        }
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
                                    uuid={draggingDetail.card.uuid}
                                    code={draggingDetail.card.code || 'cardback'}
                                    orientation={
                                        isRotated(draggingDetail.card, draggingDetail.orientation)
                                            ? 'rotated'
                                            : draggingDetail.orientation
                                    }
                                    start={draggingDetail.start}
                                    grab={draggingDetail.grab}
                                    scale={draggingDetail.scale}
                                    rectRef={carriedRectRef}
                                />
                            )}
                        </DndContext>
                    </div>
                    <GameChat
                        className='shrink-0 grow-0'
                        isOpen={showGameChat}
                        onToggle={onChatToggle}
                        messages={currentGame.messages}
                        onSendChat={onSendChat}
                        muted={!thisPlayer && currentGame.muteSpectators}
                        inputRef={chatInputRef}
                        onUnreadChange={setChatUnread}
                        animate={adaptive}
                    />
                </div>
            </MotionConfig>
            {dragGhost &&
                createPortal(
                    <div
                        className='fixed z-[400] pointer-events-none'
                        style={{
                            left: dragGhost.rect.left,
                            top: dragGhost.rect.top,
                            '--card-scale': dragGhost.scale,
                            scale:
                                dragGhost.target === 'underneath' ? '1' : String(elevation.carried)
                        }}
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
                promptDupes={userPlayer.promptDupes}
                promptedActionWindows={userPlayer.promptedActionWindows}
                hideInterrupts={userPlayer.hideInterrupts}
                hideReactions={userPlayer.hideReactions}
                fullScreen={phoneLayout}
            />
            <KeyboardShortcutsModal
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
                fullScreen={phoneLayout}
            />
        </>
    );
};

export default GameBoard;
