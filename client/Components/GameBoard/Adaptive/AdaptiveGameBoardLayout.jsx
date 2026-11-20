import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComment,
    faCommentSlash,
    faUpDownLeftRight,
    faVideo
} from '@fortawesome/free-solid-svg-icons';

import Droppable from '../Droppable';
import GameTimer from '../GameTimer';
import PlayerBoard from '../PlayerBoard';
import SquishableCardPanel from '../SquishableCardPanel';
import { AreaLabelContext } from '../LabelledGameArea';
import { PopupHostContext } from '../PopupContainer';
import { AdaptiveBoardContext } from '../adaptiveContext';
import { pileRise } from '../PileDepth';
import { findPendingAttachment, withoutPendingAttachment } from '../pendingAttachment';
import { findLeftBehind } from '../leftBehind';
import { sendButtonClickedMessage } from '../../../redux/reducers/game';
import { useLayoutMode } from './useBoardLayout';
import GameMenu from './GameMenu';
import PlayerStatsBar from './PlayerStatsBar';
import PlotFactionStack from './PlotFactionStack';
import PileCluster from './PileCluster';
import HandTray from './HandTray';
import HandFan from './HandFan';
import Reveal from './Reveal';
import ShadowsZone from './ShadowsZone';
import ScrollArea from './ScrollArea';
import PromptBar from './PromptBar';
import SheetHost from './SheetHost';
import FullscreenToggle from './FullscreenToggle';
import { useHud } from '../../../hudStore';
import { promptSideOf } from '../../../hud';
import { tableRows } from '../seatOrder';
import { activePlayerOf, followTarget } from './followTarget';
import useAutoFollow from './useAutoFollow';
import { useCardHover } from '../../Images/cardHoverStore';
import { boardRescaleEvent } from '../useHudScale';

// A part drawn at another of the board's scales: every card size inside follows --card-scale
const Part = ({ area, scale, className, style, children }) => (
    <div
        data-region={area}
        className={classNames('relative min-w-0 min-h-0', className)}
        style={scale ? { '--card-scale': `var(--${scale}-scale)`, ...style } : style}
    >
        {children}
    </div>
);

// Each side holds its strips and its play area. The sides are given the height of their strips to start from and
// share what is left equally, so both play areas are the same height even when one side's strip wraps.
const useEqualPlayAreas = (boardRef, mode) => {
    const [chrome, setChrome] = useState({ top: 0, bottom: 0 });
    useLayoutEffect(() => {
        const board = boardRef.current;
        if (!board) {
            return;
        }
        const measure = () => {
            const next = {};
            for (const side of ['top', 'bottom']) {
                const element = board.querySelector(`[data-side='${side}']`);
                const play = element?.querySelector('[data-region="play"]');
                next[side] =
                    element && play ? Math.round(element.offsetHeight - play.offsetHeight) : 0;
            }
            setChrome((current) =>
                Math.abs(current.top - next.top) <= 1 && Math.abs(current.bottom - next.bottom) <= 1
                    ? current
                    : next
            );
        };
        measure();
        const observer = new ResizeObserver(measure);
        board
            .querySelectorAll('[data-side] [data-region="strip"]')
            .forEach((part) => observer.observe(part));
        board.querySelectorAll('[data-side]').forEach((side) => observer.observe(side));
        return () => observer.disconnect();
    }, [boardRef, mode]);
    return {
        top: { flex: `1 1 ${chrome.top}px` },
        bottom: { flex: `1 1 ${chrome.bottom}px` }
    };
};

// The desktop's prompt is drawn a size up from the rest of the interface, its text being what is read most
const promptBoost = 1.15;
// How wide the prompt is as a panel over the side of the play areas (on a desktop): like classic's, following the
// interface size
const floatingPromptWidth = `calc(var(--ui-scale, 1) * ${promptBoost} * clamp(12rem, 20vw, 16rem))`;
// The room the chat button takes beside the game menu in the desktop's bar, in pixels at the interface's size
const chatButtonRoom = 36;
// Phone landscape's column down one side: the stats at its top and bottom, the prompt and our tools between
const columnWidth = 'clamp(13rem, 30vw, 20rem)';

// Room at the start and end of a play area for what lies over the board's sides (the prompt), so its cards only go
// under that once scrolled
const Room = ({ width }) => <div aria-hidden className='shrink-0' style={{ width }} />;
const coverBefore = 'var(--board-cover-left, 0px)';
const coverAfter = 'var(--board-cover-right, 0px)';

// Characters and locations take a row each, or share one in phone landscape (inline).
// promptSide (phone landscape): the play area keeps the column's width spare on the far side, and its cards stick
// beside the column as the board scrolls under it. Sticky rather than set on scroll, which lags a frame on phones.
const PlayArea = ({ inline, promptSide, children }) => {
    const cards = children(inline ? 'inline' : 'nowrap');
    return (
        <Part area='play' className='flex flex-1 !min-h-[auto]'>
            <Room width={coverBefore} />
            {promptSide ? (
                <div
                    className={classNames('flex min-w-0 flex-1', {
                        'flex-row-reverse': promptSide === 'right'
                    })}
                >
                    <div
                        className='sticky flex min-w-0 flex-1'
                        style={{ [promptSide]: columnWidth }}
                    >
                        {cards}
                    </div>
                    <Room width={columnWidth} />
                </div>
            ) : (
                cards
            )}
            <Room width={coverAfter} />
        </Part>
    );
};

// A row drawn smaller, as a whole, when it is wider than the room it has. It sets the interface's size for what is
// inside it, which every part of a stats bar follows.
const FitRow = ({ className, start = false, children }) => {
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const scaleRef = useRef({ ui: null, fit: 1 });
    const [scale, setScale] = useState(null);
    useLayoutEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) {
            return;
        }
        const measure = () => {
            const ui =
                parseFloat(
                    getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')
                ) || 1;
            const current = scaleRef.current;
            // The row is drawn at the scale it was last given (the page's, before the first measure)
            const shown = (current.ui ?? ui) * current.fit;
            const natural = (inner.getBoundingClientRect().width * ui) / shown;
            const fit = natural > 0 ? Math.min(1, outer.clientWidth / natural) : 1;
            if (Math.abs(fit - current.fit) > 0.01 || current.ui !== ui) {
                scaleRef.current = { ui, fit };
                setScale({ ui, fit });
            }
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(outer);
        observer.observe(inner);
        window.addEventListener(boardRescaleEvent, measure);
        return () => {
            observer.disconnect();
            window.removeEventListener(boardRescaleEvent, measure);
        };
    }, []);
    return (
        <div
            ref={outerRef}
            className={classNames(
                'flex min-w-0 overflow-hidden',
                start ? 'justify-start' : 'justify-center',
                className
            )}
        >
            <div
                ref={innerRef}
                className='w-max shrink-0'
                style={scale ? { '--ui-scale': String(scale.ui * scale.fit) } : undefined}
            >
                {children}
            </div>
        </div>
    );
};

// A player's avatar and stats on a slim band, shrunk to fit (phone landscape and portrait).
// active: tinted while they are waited on, at a melee table. start: left-aligned rather than centred (portrait).
const StatsCard = ({
    player,
    canChange,
    showSeat,
    active = false,
    start = false,
    className,
    ...props
}) => (
    <div {...props} className={classNames('pointer-events-auto', className)}>
        <FitRow className='px-1' start={start}>
            <PlayerStatsBar
                player={player}
                vertical
                columns={6}
                compact
                canChange={canChange}
                showSeat={showSeat}
                backdrop={active ? 'bg-sky-950/80' : 'bg-black/60'}
            />
        </FitRow>
    </div>
);

// Tools beside a stats card, in a box of their own
const ToolBox = ({ className, children, ...props }) => (
    <div
        {...props}
        className={classNames(
            'pointer-events-auto flex items-center gap-0.5 rounded-md border border-default-200/40 bg-black/60 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hud-zoom',
            className
        )}
    >
        {children}
    </div>
);

const AdaptiveGameBoardLayout = ({
    thisPlayer,
    otherPlayers,
    userPlayer,
    onCardClick,
    onSettingsClick,
    onShortcutsClick,
    chat,
    isDragging
}) => {
    const dispatch = useDispatch();
    const mode = useLayoutMode();
    const dividerRef = useRef(null);
    const hud = useHud();
    const promptSide = promptSideOf(hud);
    // In phone landscape the prompt and the players' stats share a column down one side of the screen. On a desktop
    // the prompt is a panel over the side of the play areas. In portrait it sits below our hand.
    const short = mode === 'short';
    const floatingPrompt = mode === 'wide';
    // Melee seats everyone round a table of two rows, each player's stats on their own board
    const melee = otherPlayers.length > 1;
    const columnRef = useRef(null);
    // How much of each side of the play areas is covered by the prompt (the board runs on under it, showing through)
    const coverOf = (side) => {
        if (side !== promptSide) {
            return '0px';
        }
        return floatingPrompt
            ? 'calc(var(--board-prompt-width) + var(--board-prompt-inset, 0px))'
            : '0px';
    };
    const boardRef = useRef(null);
    const sideFlex = useEqualPlayAreas(boardRef, mode);
    // At a melee table the view follows the action, unless turned off in the HUD settings. It waits while a card is
    // carried or zoomed.
    const zoomed = useCardHover((current) => !!current.code);
    // At a melee table the stats bars keep to the view's top and bottom, so the hints of more above and below show
    // inside them rather than under them
    useLayoutEffect(() => {
        const board = boardRef.current;
        if (!board) {
            return;
        }
        const bars = [...board.querySelectorAll('[data-seat-bar]')];
        const measure = () => {
            for (const side of ['top', 'bottom']) {
                const height = Math.max(
                    0,
                    ...bars
                        .filter((bar) => bar.dataset.seatBar === side)
                        .map((bar) => bar.offsetHeight)
                );
                board.style.setProperty(`--board-hint-${side}`, `${height}px`);
            }
        };
        measure();
        const observer = new ResizeObserver(measure);
        bars.forEach((bar) => observer.observe(bar));
        return () => {
            observer.disconnect();
            board.style.removeProperty('--board-hint-top');
            board.style.removeProperty('--board-hint-bottom');
        };
    }, [mode, melee, otherPlayers.length]);
    const followed = useAutoFollow({
        boardRef,
        target: followTarget(thisPlayer, otherPlayers),
        active: activePlayerOf(thisPlayer, otherPlayers),
        enabled: melee,
        waiting: isDragging || zoomed
    });
    const manualMode = useSelector((state) => !!state.lobby.currentGame?.manualMode);
    const username = useSelector((state) => state.auth.user?.username);
    const isPlaying = !!thisPlayer && thisPlayer.user?.username === username;
    const canChangeStats = isPlaying && manualMode;
    // Our piles that only show while they hold cards are offered empty too, in manual mode and while a card is
    // carried, as places to put one
    const offerEmpty = isDragging;
    const phoneLayout = mode !== 'wide';
    const portrait = mode === 'narrow';
    const pileScale = phoneLayout ? 'pile' : null;
    // In portrait our hand has a row of its own below our board, scrolling with it; elsewhere it sits in our strip
    const handTrayShown = portrait && isPlaying;

    // seat: where the board sits in its row of a melee table, 0 for the first; below: what goes under our board
    const renderSide = (player, side, { seat = 0, below = null } = {}) => {
        // A spectator watches the bottom player, but cannot act for them: no drops, and no hand of their own
        const isMe = isPlaying && player === thisPlayer;
        const pileProps = {
            onCardClick,
            popupLocation: side,
            popupId: seat === 0 ? side : `${side}-${seat}`,
            playerName: player.user?.username
        };
        const droppable = (source, children, count, className = 'self-start') =>
            isMe ? (
                <Droppable
                    source={source}
                    className={className}
                    rise={count === undefined ? undefined : pileRise(count)}
                >
                    {children}
                </Droppable>
            ) : (
                children
            );
        const handInStrip = !(isMe && handTrayShown);
        // An opponent's hand is squeezed to fit on a phone; on a desktop it is as wide as ours
        const squishHand = !isMe && phoneLayout;
        const hand = withoutPendingAttachment(player.cardPiles.hand);
        const shadows = withoutPendingAttachment(player.cardPiles.shadows);
        // An opponent's hand fans out over their half when tapped or chosen from: the top half, or at a melee table
        // the bottom half for those seated along the bottom row
        const fanned = (panel) =>
            player !== thisPlayer ? (
                <HandFan
                    cards={hand}
                    side={side}
                    playerName={player.user?.username}
                    onCardClick={onCardClick}
                >
                    {panel}
                </HandFan>
            ) : (
                panel
            );

        // Plots, agenda, faction, hand and piles in one row, as a dark band so cards scrolling under it end cleanly
        const strip = (
            <div
                data-region='strip'
                className={classNames(
                    'flex shrink-0 flex-nowrap items-start bg-black/40 px-1',
                    portrait
                        ? 'gap-1 py-2'
                        : short
                          ? // A card raised in our hand needs room above it in the strip, which clips what spills out.
                            // Every strip keeps that room on its play area's side, so the halves mirror each other.
                            classNames(
                                'gap-2',
                                side === 'top'
                                    ? 'pb-[calc(var(--pile-scale,1)*0.75rem+0.25rem)] pt-1'
                                    : 'pb-1 pt-[calc(var(--pile-scale,1)*0.75rem+0.25rem)]'
                            )
                          : 'gap-2 py-3',
                    side === 'top'
                        ? 'border-b border-default-200/40'
                        : 'border-t border-default-200/40'
                )}
                style={
                    short
                        ? { [promptSide === 'right' ? 'paddingRight' : 'paddingLeft']: columnWidth }
                        : undefined
                }
            >
                <Part area='id' scale={pileScale} className='shrink !min-w-min'>
                    <PlotFactionStack
                        player={player}
                        isMe={isMe}
                        side={side}
                        onCardClick={onCardClick}
                        pileProps={pileProps}
                        droppable={droppable}
                    />
                </Part>
                {handInStrip && (
                    <Part
                        area='hand'
                        scale={pileScale}
                        className={
                            squishHand
                                ? 'min-w-[calc(var(--card-scale,1)*4.4rem)] shrink grow-0 basis-[calc(var(--card-scale,1)*12rem)]'
                                : 'shrink-0'
                        }
                    >
                        {fanned(
                            droppable(
                                'hand',
                                <SquishableCardPanel
                                    cards={hand}
                                    groupVisibleCards
                                    fitWidth={squishHand}
                                    maxCards={squishHand ? 3 : 5}
                                    onCardClick={onCardClick}
                                    source='hand'
                                    title='Hand'
                                    flipFrom={player.user?.username}
                                    stagedArrivals={isMe}
                                    redeal={player.phase === 'setup'}
                                />
                            )
                        )}
                    </Part>
                )}
                {handInStrip && (
                    <Reveal
                        show={shadows.length > 0 || (isMe && offerEmpty)}
                        className='shrink-0 self-stretch'
                    >
                        <Part area='shadows' scale={pileScale} className='h-full'>
                            <ShadowsZone
                                cards={shadows}
                                onCardClick={onCardClick}
                                droppable={droppable}
                            />
                        </Part>
                    </Reveal>
                )}
                <Part area='piles' scale={pileScale} className='flex shrink-0'>
                    <PileCluster
                        player={player}
                        isMe={isMe}
                        spectating={!thisPlayer}
                        pileProps={pileProps}
                        droppable={droppable}
                        offerEmpty={offerEmpty}
                    />
                </Part>
            </div>
        );

        const play = (
            <PlayArea inline={short} promptSide={short ? promptSide : null}>
                {(overflow) => (
                    <PlayerBoard
                        isDroppable={isMe}
                        cardsInPlay={player.cardPiles.cardsInPlay}
                        pendingAttachment={findPendingAttachment(player.cardPiles)}
                        leftBehind={findLeftBehind(player.cardPiles)}
                        onCardClick={onCardClick}
                        rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                        overflow={overflow}
                    />
                )}
            </PlayArea>
        );

        // Phone landscape: the player's stats card, at the top (theirs) or bottom (ours) of the prompt's column. It sits
        // in its board's strip while the column is clear of the board, then sticks to the screen's side until the
        // board's end reaches it. It is in a layer over the whole board so it can stick across boards.
        const rail = short && (
            <div
                className={classNames(
                    'pointer-events-none absolute inset-0 z-[300] flex flex-col',
                    promptSide === 'right' ? 'items-end' : 'items-start',
                    side === 'top' ? 'justify-start' : 'justify-end'
                )}
            >
                <StatsCard
                    data-region='stats-rail'
                    data-rail-side={side}
                    player={player}
                    canChange={isMe && canChangeStats}
                    showSeat={melee}
                    active={melee && player.isActivePrompt}
                    style={{ width: `calc(${columnWidth} - 0.5rem)` }}
                    className={classNames(
                        'sticky my-1',
                        promptSide === 'right' ? 'right-1' : 'left-1',
                        side === 'top' ? 'top-1' : 'bottom-1'
                    )}
                />
            </div>
        );

        // At a melee table each player's stats bar sticks to their board's outer edge as the table scrolls
        const seatBar = melee && !short && (
            <div
                data-seat-bar={side}
                className={classNames(
                    'sticky z-[245] shrink-0',
                    side === 'top' ? 'top-0' : 'bottom-0'
                )}
            >
                {portrait ? (
                    <div
                        className={classNames(
                            'sticky left-0 w-[min(100%,var(--scroll-view-width,100%))] px-1',
                            side === 'top' ? 'pb-1 pt-0.5' : 'py-1',
                            { 'pr-[calc(var(--board-tools-width,0px)+0.5rem)]': side === 'bottom' }
                        )}
                    >
                        <StatsCard
                            player={player}
                            start
                            canChange={isMe && canChangeStats}
                            showSeat
                            active={player.isActivePrompt}
                        />
                    </div>
                ) : (
                    <PlayerStatsBar
                        player={player}
                        compact={phoneLayout}
                        canChange={isMe && canChangeStats}
                        showSeat
                        className={classNames(
                            'sticky left-0 w-[min(100%,var(--scroll-view-width,100%))] py-1.5',
                            side === 'top' ? 'border-b' : 'border-t',
                            { 'bg-sky-950/80': player.isActivePrompt }
                        )}
                    >
                        {/* Along the bottom, room for our tools pinned in the view's corner */}
                        {side === 'bottom' && (
                            <span
                                aria-hidden
                                className='block'
                                style={{ width: 'var(--board-tools-width, 0px)' }}
                            />
                        )}
                    </PlayerStatsBar>
                )}
            </div>
        );

        return (
            <div
                data-side={side}
                data-player={player.user?.username}
                className={classNames('relative flex w-full flex-1', {
                    'bg-sky-300/5': melee && player.isActivePrompt
                })}
            >
                {promptSide === 'left' && rail}
                <div className='flex min-w-0 flex-1 flex-col'>
                    {side === 'top' ? (
                        <>
                            {seatBar}
                            {strip}
                            {play}
                        </>
                    ) : (
                        <>
                            {play}
                            {strip}
                            {below}
                            {seatBar}
                        </>
                    )}
                </div>
                {promptSide === 'right' && rail}
            </div>
        );
    };

    const onButtonClick = (button) =>
        dispatch(
            sendButtonClickedMessage(button.promptId, button.command, button.method, button.arg)
        );
    // The chat button among our tools, in place of the chat's tab
    // inBar: in the desktop's stats bar, as tall as the bar
    const chatButton = (inBar = false) =>
        chat && (
            <Button
                isIconOnly
                size='sm'
                variant='light'
                radius={inBar ? 'none' : undefined}
                className={classNames(
                    'relative min-w-7 overflow-visible',
                    inBar ? 'h-full w-9' : 'h-7 w-7'
                )}
                title={chat.open ? 'Hide chat' : 'Show chat'}
                aria-expanded={chat.open}
                onPress={chat.onToggle}
            >
                <FontAwesomeIcon
                    icon={chat.open ? faCommentSlash : faComment}
                    className='text-base'
                />
                {!chat.open && chat.unread > 0 && (
                    <span
                        className={classNames(
                            'absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white',
                            inBar ? 'right-0.5 top-0.5' : '-right-1 -top-1'
                        )}
                    >
                        {chat.unread > 99 ? '99+' : chat.unread}
                    </span>
                )}
            </Button>
        );
    // At a melee table: whether the view follows the action (directed) or not (manual), and switches it
    const followToggle = melee && (
        <Button
            isIconOnly
            size='sm'
            variant='flat'
            data-follow={followed.paused ? 'manual' : 'directed'}
            className={classNames(
                'h-7 w-7 min-w-7 border',
                followed.paused
                    ? 'border-amber-400/70 bg-amber-500/25 text-amber-300'
                    : 'border-sky-400/70 bg-sky-500/25 text-sky-300'
            )}
            title={
                followed.paused
                    ? 'View: manual. Tap to follow the action.'
                    : 'View: directed, following the action. Tap to move it yourself.'
            }
            onPress={followed.paused ? followed.resume : followed.stop}
        >
            <FontAwesomeIcon
                icon={followed.paused ? faUpDownLeftRight : faVideo}
                className='text-base'
            />
        </Button>
    );
    // Our game menu, given the room our stats leave (the desktop's joust bar) to show what fits as buttons
    const gameMenu = (room) => (
        <GameMenu
            isPlaying={isPlaying}
            onSettingsClick={onSettingsClick}
            onShortcutsClick={onShortcutsClick}
            room={room}
        />
    );

    // Our tools, beside our own stats: the view's mode, the chat, full screen (phones) and the menu, outermost
    const tools = (className) => (
        <ToolBox data-region='tools' className={className}>
            {followToggle}
            {chatButton()}
            {phoneLayout && <FullscreenToggle />}
            {gameMenu(0)}
        </ToolBox>
    );
    const promptBar = (barMode, className, allOptions = false, stackOptions = false) => (
        <PromptBar
            className={className}
            allOptions={allOptions}
            stackOptions={stackOptions}
            mode={barMode}
            phase={thisPlayer?.phase}
            promptTitle={userPlayer?.promptTitle}
            promptText={isPlaying ? userPlayer?.menuTitle : 'Spectating'}
            buttons={userPlayer?.buttons}
            controls={userPlayer?.controls}
            selecting={!!userPlayer?.selectCard}
            onButtonClick={onButtonClick}
            timer={<GameTimer player={thisPlayer} isMe={!!thisPlayer} side='bottom' />}
        />
    );

    // On a desktop the prompt is a panel lying over the side of both play areas, centred on the line between them, and
    // keeping still as the board scrolls sideways under it. Elsewhere the line between the halves is the middle of the
    // board's view.
    const divider = floatingPrompt ? (
        <div
            data-region='mid'
            className='sticky left-0 z-[250] h-0 shrink-0'
            style={{ width: 'var(--scroll-view-width, 100%)' }}
        >
            <div
                ref={dividerRef}
                data-region='prompt-float'
                className={classNames(
                    'absolute top-0 -translate-y-1/2',
                    promptSide === 'right' ? 'right-[var(--board-prompt-inset)]' : 'left-0'
                )}
                style={{
                    width: 'var(--board-prompt-width)',
                    // --text-scale carries the interface's scale too (interfaceScaleProperties)
                    '--ui-scale': `calc(var(--text-scale, 1) * ${promptBoost})`
                }}
            >
                {promptBar(
                    'panel',
                    classNames(
                        'border shadow-[0_6px_18px_rgba(0,0,0,0.6)]',
                        promptSide === 'right' ? 'rounded-md' : 'rounded-r-md border-l-0'
                    ),
                    false,
                    true
                )}
            </div>
        </div>
    ) : null;
    const midline = !floatingPrompt && (
        <div
            ref={dividerRef}
            data-region='mid'
            aria-hidden
            className='pointer-events-none absolute inset-x-0 top-1/2 h-0'
        />
    );

    // Publishes where the divider, prompt, view, tools and column are, for what lies over the board (fanned hands,
    // the prompt's options, the phone chat) to keep to
    const topBarsRef = useRef(null);
    useLayoutEffect(() => {
        const divider = dividerRef.current;
        if (!divider) {
            return;
        }
        const root = document.documentElement;
        const place = () => {
            const rect = divider.getBoundingClientRect();
            root.style.setProperty('--board-divider-top', `${rect.top}px`);
            root.style.setProperty('--board-divider-bottom', `${rect.bottom}px`);
            const bar = document.querySelector('[data-prompt-bar]')?.getBoundingClientRect();
            root.style.setProperty('--board-prompt-bottom', `${bar ? bar.bottom : rect.bottom}px`);
            const view = boardRef.current
                ?.querySelector('[data-board-scroll]')
                ?.getBoundingClientRect();
            root.style.setProperty(
                '--board-view-bottom',
                `${view ? view.bottom : window.innerHeight}px`
            );
            const bars = topBarsRef.current?.getBoundingClientRect();
            const column = columnRef.current?.getBoundingClientRect();
            const onRight = promptSide === 'right';
            const width = document.documentElement.clientWidth;
            root.style.setProperty('--board-chat-top', `${bars ? bars.bottom : 0}px`);
            // In portrait our tools are at the bottom, and the chat stops above them, the chat button in reach
            const toolsRect = boardRef.current
                ?.querySelector('[data-region="tools"]')
                ?.getBoundingClientRect();
            root.style.setProperty('--board-tools-width', `${toolsRect ? toolsRect.width : 0}px`);
            root.style.setProperty(
                '--board-chat-bottom',
                `${mode === 'narrow' && toolsRect ? window.innerHeight - toolsRect.top + 4 : 0}px`
            );
            // The prompt and our tools keep between the stats at the top and bottom of the column
            const topRail = boardRef.current
                ?.querySelector('[data-rail-side="top"]')
                ?.getBoundingClientRect();
            const bottomRail = boardRef.current
                ?.querySelector('[data-rail-side="bottom"]')
                ?.getBoundingClientRect();
            root.style.setProperty('--board-rail-top', `${topRail ? topRail.bottom : 0}px`);
            root.style.setProperty(
                '--board-rail-bottom',
                `${bottomRail ? window.innerHeight - bottomRail.top : 0}px`
            );
            root.style.setProperty(
                '--board-chat-left',
                `${column && !onRight ? column.right : 0}px`
            );
            root.style.setProperty(
                '--board-chat-right',
                `${column && onRight ? width - column.left : 0}px`
            );
        };
        place();
        const observer = new ResizeObserver(place);
        observer.observe(divider);
        observer.observe(document.body);
        [
            topBarsRef.current,
            columnRef.current,
            boardRef.current?.querySelector('[data-region="tools"]'),
            boardRef.current?.querySelector('[data-board-scroll]'),
            document.querySelector('[data-prompt-bar]'),
            boardRef.current?.querySelector('[data-side="top"]'),
            ...(boardRef.current?.querySelectorAll('[data-region="stats-rail"]') ?? [])
        ].forEach((element) => element && observer.observe(element));
        window.addEventListener('resize', place);
        // The desktop's prompt, and the stats in phone landscape, move with the board as it scrolls
        const scroller = boardRef.current?.querySelector('[data-board-scroll] [data-clips]');
        scroller?.addEventListener('scroll', place, { passive: true });
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', place);
            scroller?.removeEventListener('scroll', place);
            [
                '--board-divider-top',
                '--board-divider-bottom',
                '--board-prompt-bottom',
                '--board-view-bottom',
                '--board-chat-top',
                '--board-chat-bottom',
                '--board-tools-width',
                '--board-chat-left',
                '--board-chat-right',
                '--board-rail-top',
                '--board-rail-bottom'
            ].forEach((name) => root.style.removeProperty(name));
        };
    }, [mode, promptSide]);

    const opponents = otherPlayers.map((player) => (
        <div
            key={player.name ?? player.seatNo}
            className='flex flex-1 border-b border-default-200/30'
            style={sideFlex.top}
        >
            {renderSide(player, 'top')}
        </div>
    ));
    const ours = (
        <div className='flex flex-1' style={sideFlex.bottom}>
            {renderSide(thisPlayer, 'bottom')}
        </div>
    );
    const handTray = handTrayShown && (
        <div
            data-region='hand-tray'
            className='shrink-0 bg-black/40 px-1 pb-1 pt-2'
            style={{ '--card-scale': 'var(--hand-scale)' }}
        >
            <HandTray
                player={thisPlayer}
                onCardClick={onCardClick}
                offerEmpty={offerEmpty}
                droppable={(source, children, count, className) => (
                    <Droppable source={source} className={className}>
                        {children}
                    </Droppable>
                )}
            />
        </div>
    );

    // A melee table: two rows of boards, us at the bottom left. The room for the desktop's prompt is a column at each
    // side of the table, which the end boards' stats and strips reach into; only their play areas keep clear of it.
    const table = melee
        ? (() => {
              const rows = tableRows(thisPlayer, [thisPlayer, ...otherPlayers]);
              const columns = Math.max(rows.top.length, rows.bottom.length);
              const cell = (player, side, index) => (
                  <div
                      key={player.user?.username ?? player.seatNo}
                      data-seat={player.user?.username}
                      className={classNames('flex border-default-200/30', {
                          'border-l': index > 0,
                          'border-b': side === 'top'
                      })}
                      style={{
                          gridColumn: `${index === 0 ? 1 : index + 2} / ${index === columns - 1 ? columns + 3 : index + 3}`,
                          gridRow: side === 'top' ? 1 : floatingPrompt ? 3 : 2,
                          '--board-cover-left': index === 0 ? coverOf('left') : '0px',
                          '--board-cover-right': index === columns - 1 ? coverOf('right') : '0px'
                      }}
                  >
                      {renderSide(player, side, {
                          seat: index,
                          below: player === thisPlayer ? handTray : null
                      })}
                  </div>
              );
              return (
                  <div
                      data-melee-table=''
                      className='relative grid min-h-full flex-1'
                      style={{
                          gridTemplateColumns: `${coverOf('left')} repeat(${columns}, auto) ${coverOf('right')}`,
                          // auto, not fr: equal rows would stretch the top row to ours, opening gaps in the
                          // opponents' play areas. The prompt's row takes no height.
                          gridTemplateRows: floatingPrompt ? 'auto 0px auto' : 'auto auto',
                          '--board-cover-left': '0px',
                          '--board-cover-right': '0px'
                      }}
                  >
                      {['left', 'right'].map((end) => (
                          <div
                              key={end}
                              aria-hidden
                              data-table-cover={end}
                              style={{ gridRow: 1, gridColumn: end === 'left' ? 1 : columns + 2 }}
                          />
                      ))}
                      {rows.top.map((player, index) => cell(player, 'top', index))}
                      {floatingPrompt && (
                          <div className='self-center' style={{ gridRow: 2, gridColumn: '1 / -1' }}>
                              {divider}
                          </div>
                      )}
                      {rows.bottom.map((player, index) => cell(player, 'bottom', index))}
                  </div>
              );
          })()
        : null;

    return (
        <AdaptiveBoardContext.Provider value={true}>
            <PopupHostContext.Provider value='sheet'>
                <AreaLabelContext.Provider value={phoneLayout ? 'inspect' : 'full'}>
                    <div
                        data-layout={mode}
                        className='relative flex h-full w-full overflow-hidden'
                        style={{
                            '--board-prompt-width': floatingPromptWidth,
                            '--board-prompt-inset': '0px',
                            '--board-cover-left': coverOf('left'),
                            '--board-cover-right': coverOf('right')
                        }}
                    >
                        {short && (
                            <div
                                data-region='prompt-column'
                                className={classNames(
                                    'pointer-events-none absolute z-[305] flex flex-col pb-[calc(var(--board-rail-bottom,0px)+0.25rem)] pt-[calc(var(--board-rail-top,0px)+0.25rem)]',
                                    promptSide === 'right'
                                        ? 'bottom-0 right-0 top-0 pr-[env(safe-area-inset-right)]'
                                        : 'bottom-0 left-0 top-0 pl-[env(safe-area-inset-left)]'
                                )}
                                style={{ width: columnWidth }}
                            >
                                {/* The prompt, between the players' stats, centred until it grows too tall for
                                    the room and scrolls (auto margins, which unlike centring leave its top in reach) */}
                                <div
                                    data-region='prompt-scroll'
                                    className='flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-1 [scrollbar-width:none]'
                                >
                                    <div
                                        ref={columnRef}
                                        data-region='prompt-panel'
                                        className='pointer-events-auto my-auto shrink-0'
                                    >
                                        {promptBar(
                                            'panel',
                                            'rounded-md border shadow-[0_6px_18px_rgba(0,0,0,0.6)]',
                                            true
                                        )}
                                    </div>
                                </div>
                                {/* Our tools, against the screen's edge just above our stats: the menu outermost,
                                    then full screen, then the chat */}
                                <div
                                    data-region='column-tools'
                                    className={classNames(
                                        'flex shrink-0 px-1',
                                        promptSide === 'right' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {tools(
                                        classNames({ 'flex-row-reverse': promptSide !== 'right' })
                                    )}
                                </div>
                            </div>
                        )}
                        {/* The bars run to the screen's edges; what lies between them keeps clear of a notch or
                            rounded corners at the sides */}
                        <div ref={boardRef} className='flex min-w-0 flex-1 flex-col'>
                            {portrait && !melee && (
                                <div
                                    ref={topBarsRef}
                                    data-sheet-edge='top'
                                    className='relative z-[305] flex shrink-0 items-center gap-1 px-1 pb-1 pt-[calc(var(--safe-top)+0.125rem)]'
                                >
                                    {otherPlayers.map((player) => (
                                        <StatsCard
                                            key={player.name ?? player.seatNo}
                                            player={player}
                                            start
                                            className='min-w-0 flex-1'
                                        />
                                    ))}
                                </div>
                            )}
                            {floatingPrompt && !melee && (
                                <div ref={topBarsRef} className='relative z-[305] shrink-0'>
                                    {otherPlayers.map((player) => (
                                        <PlayerStatsBar
                                            key={player.name ?? player.seatNo}
                                            player={player}
                                            compact={phoneLayout}
                                            edge='top'
                                            className='border-b'
                                        ></PlayerStatsBar>
                                    ))}
                                </div>
                            )}
                            <div
                                className={classNames('flex min-h-0 flex-1 flex-col', {
                                    'pl-[env(safe-area-inset-left)]':
                                        !short || promptSide === 'right',
                                    'pr-[env(safe-area-inset-right)]':
                                        !short || promptSide === 'left',
                                    'pb-[var(--safe-bottom)] pt-[var(--safe-top)]': short
                                })}
                            >
                                {/* The whole board, both sides, scrolls as one, starting at our side and the plots */}
                                <div
                                    data-board-scroll=''
                                    className='relative flex min-h-0 min-w-0 flex-1'
                                >
                                    <ScrollArea
                                        className='flex-1'
                                        axis='both'
                                        anchor='end'
                                        contentClassName='relative flex-col'
                                    >
                                        {melee ? (
                                            table
                                        ) : (
                                            <>
                                                {opponents}
                                                {divider}
                                                {ours}
                                                {handTray}
                                            </>
                                        )}
                                        {/* Cards in flight, scrolling with the board (flip.js) */}
                                        <div
                                            data-flight-layer=''
                                            aria-hidden
                                            className='pointer-events-none absolute inset-0 z-[290]'
                                        />
                                    </ScrollArea>
                                    {midline}
                                    {/* At a melee table our stats keep to our own board, so our tools are pinned to
                                        the view's bottom corner beside them, staying when our board scrolls away */}
                                    {melee &&
                                        !short &&
                                        tools('absolute bottom-1.5 right-1 z-[246]')}
                                </div>
                            </div>
                            {portrait && !melee && (
                                <div
                                    data-sheet-edge='bottom'
                                    className='relative z-[306] flex shrink-0 items-center gap-1 p-1'
                                >
                                    <StatsCard
                                        player={thisPlayer}
                                        start
                                        canChange={canChangeStats}
                                        className='min-w-0 flex-1'
                                    />
                                    {tools('shrink-0')}
                                </div>
                            )}
                            {floatingPrompt && !melee && (
                                <PlayerStatsBar
                                    player={thisPlayer}
                                    canChange={canChangeStats}
                                    compact={phoneLayout}
                                    edge='bottom'
                                    className='border-t !z-[306]'
                                >
                                    {(room) => (
                                        <>
                                            {gameMenu(Math.max(0, room - chatButtonRoom))}
                                            {chatButton(true)}
                                        </>
                                    )}
                                </PlayerStatsBar>
                            )}
                            {/* In portrait the prompt is at the very bottom, below our stats */}
                            {portrait && promptBar('dock')}
                        </div>
                    </div>
                    <SheetHost mode={mode} />
                </AreaLabelContext.Provider>
            </PopupHostContext.Provider>
        </AdaptiveBoardContext.Provider>
    );
};

export default AdaptiveGameBoardLayout;
