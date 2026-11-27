import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Button from '../../Site/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentSlash, faVideo } from '@fortawesome/free-solid-svg-icons';

import Droppable from '../Droppable';
import GameTimer from '../GameTimer';
import PlayerBoard from '../PlayerBoard';
import SquishableCardPanel from '../SquishableCardPanel';
import { AreaLabelContext } from '../LabelledGameArea';
import { PopupHostContext } from '../PopupContainer';
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
import BoardOverlays from './BoardOverlays';
import ConnectionLost from './ConnectionLost';
import FullscreenToggle from './FullscreenToggle';
import { toolButtonClass } from './toolButton';
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

// The sides start from their strips' heights and share the rest equally, so both play areas match even when one
// strip wraps
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

// The desktop's prompt is a size up from the rest of the interface, being what is read most
const promptBoost = 1.15;
const floatingPromptWidth = `calc(var(--ui-scale, 1) * ${promptBoost} * clamp(12rem, 20vw, 16rem))`;
// Pixels at the interface's size
const chatButtonRoom = 50;
// A melee board's tint while its player is waited on. Its dark bands (the strip, our hand) lay it again over their
// own darkness, so they stay as much darker than the play area.
const waitedOn = 'bg-accent/6';
const waitedOnBand = 'bg-[linear-gradient(rgb(125_211_252/0.05),rgb(125_211_252/0.05))]';
// Phone landscape's column down the left: the stats at its top and bottom, the prompt and our tools between
const columnWidth = 'clamp(13rem, 30vw, 20rem)';

// Room at the start of a play area for the prompt lying over the board's left side. With the prompt in it (desktop),
// the room sticks to the left of the view and the prompt sits at its foot, rising over the opponent's room when it is
// taller, so it never makes the play area taller
const Room = ({ width, children }) =>
    children ? (
        <div className='sticky left-0 z-250 shrink-0' style={{ width }}>
            <div className='absolute inset-x-0 bottom-1'>{children}</div>
        </div>
    ) : (
        <div aria-hidden className='shrink-0' style={{ width }} />
    );
const coverBefore = 'var(--board-cover-left, 0px)';

// Characters and locations take a row each, or share one in phone landscape (inline). column (phone landscape):
// cards stick beside the column as the board scrolls; sticky, as scroll handlers lag a frame on phones.
const PlayArea = ({ inline, column, prompt, children }) => {
    const cards = children(inline ? 'inline' : 'nowrap');
    return (
        <Part area='play' className='flex flex-1 min-h-auto!'>
            <Room width={coverBefore}>{prompt}</Room>
            {column ? (
                <div className='flex min-w-0 flex-1'>
                    <div className='sticky flex min-w-0 flex-1' style={{ left: columnWidth }}>
                        {cards}
                    </div>
                    <Room width={columnWidth} />
                </div>
            ) : (
                cards
            )}
        </Part>
    );
};

// A row shrunk as a whole to fit, by lowering --ui-scale for its contents
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
    children,
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
                backdrop={active ? 'bg-banner-deep/80' : 'bg-panel/90'}
            >
                {children}
            </PlayerStatsBar>
        </FitRow>
    </div>
);

// A player's stats along the top or bottom of the board (not phone landscape). active: waited on (melee).
// stick: the band runs the board's width and the stats stick to the view's left; at the bottom they keep clear of our
// tools. The bar is zoomed by --ui-scale, so screen lengths are divided by it.
const EdgeStatsBar = ({ edge, active = false, stick = false, className, ...props }) => {
    const band = classNames(edge === 'top' ? 'border-b' : 'border-t', className);
    if (!stick) {
        return (
            <PlayerStatsBar
                {...props}
                edge={edge}
                className={classNames(band, { 'bg-banner-deep/80': active })}
            />
        );
    }
    return (
        <div
            className={classNames(
                band,
                'border-edge',
                active ? 'bg-banner-deep/80' : 'bg-panel/90'
            )}
        >
            <PlayerStatsBar
                {...props}
                edge={edge}
                className={classNames(
                    'sticky left-0 w-fit bg-transparent!',
                    edge === 'top'
                        ? 'max-w-[calc((var(--scroll-view-width,100vw)-var(--board-top-tools-width,0px))/var(--ui-scale,1)-1.5rem)]'
                        : 'max-w-[calc((var(--scroll-view-width,100vw)-var(--board-tools-width,0px))/var(--ui-scale,1)-1.5rem)]'
                )}
            />
        </div>
    );
};

// Tools (menu, chat, full screen), their buttons filling its height. inBar: framed by its stats bar, with only a line
// on its left; otherwise bordered. zoom: scales with the interface, outside a bar. solid: hides what lies under it.
const ToolGroup = ({
    className,
    zoom = false,
    inBar = false,
    solid = false,
    children,
    ...props
}) => (
    <div
        {...props}
        data-tool-group=''
        className={classNames(
            'pointer-events-auto flex shrink-0 items-stretch overflow-hidden border-edge',
            inBar ? 'border-l' : 'rounded border bg-panel/90 shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
            { 'bg-panel': solid, 'hud-zoom': zoom },
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
    const short = mode === 'short';
    const floatingPrompt = mode === 'wide';
    const melee = otherPlayers.length > 1;
    const columnRef = useRef(null);
    // The room at the board's left that the desktop prompt lies over
    const cover = floatingPrompt ? 'var(--board-prompt-width)' : '0px';
    const boardRef = useRef(null);
    const sideFlex = useEqualPlayAreas(boardRef, mode);
    const zoomed = useCardHover((current) => !!current.code);
    // Melee: the scroll hints show inside the stats bars, not under them
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
    // Our piles that only show while they hold cards are offered empty while a card is carried, to put it in
    const offerEmpty = isDragging;
    const phoneLayout = mode !== 'wide';
    const portrait = mode === 'narrow';
    const pileScale = phoneLayout ? 'pile' : null;
    // In portrait our hand has a row of its own below our board, scrolling with it; elsewhere it sits in our strip
    const handTrayShown = portrait && isPlaying;

    // seat: index in its melee row; below: what goes under our board
    const renderSide = (player, side, { seat = 0, below = null, prompt = false } = {}) => {
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
        // An opponent's hand fans out over their half when tapped or chosen from
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
                    { [waitedOnBand]: melee && player.isActivePrompt },
                    portrait
                        ? 'gap-1 py-2'
                        : short
                          ? // Room for a raised hand card, which the strip clips; on every strip, so they mirror
                            classNames(
                                'gap-2',
                                side === 'top'
                                    ? 'pb-[calc(var(--pile-scale,1)*0.75rem+0.25rem)] pt-1'
                                    : 'pb-1 pt-[calc(var(--pile-scale,1)*0.75rem+0.25rem)]'
                            )
                          : 'gap-2 py-3',
                    side === 'top' ? 'border-b border-white/6' : 'border-t border-white/6'
                )}
                style={short ? { paddingLeft: columnWidth } : undefined}
            >
                <Part area='id' scale={pileScale} className='shrink-0'>
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
            <PlayArea inline={short} column={short} prompt={prompt ? floatingPanel : null}>
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

        // Phone landscape: the stats card at the top (theirs) or bottom (ours) of the prompt's column, in a layer over
        // the whole board so it can stick across boards
        const rail = short && (
            <div
                className={classNames(
                    'pointer-events-none absolute inset-0 z-300 flex flex-col items-start',
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
                        'sticky left-1 my-1',
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
                    'sticky z-245 shrink-0',
                    side === 'top' ? 'top-0' : 'bottom-0'
                )}
            >
                <EdgeStatsBar
                    player={player}
                    edge={side}
                    stick
                    compact={phoneLayout}
                    canChange={isMe && canChangeStats}
                    showSeat
                    active={player.isActivePrompt}
                />
            </div>
        );

        return (
            <div
                data-side={side}
                data-player={player.user?.username}
                className={classNames('relative flex w-full flex-1', {
                    [waitedOn]: melee && player.isActivePrompt
                })}
            >
                {rail}
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
            </div>
        );
    };

    const onButtonClick = (button) =>
        dispatch(
            sendButtonClickedMessage(button.promptId, button.command, button.method, button.arg)
        );
    const chatButton = () =>
        chat && (
            <Button
                isIconOnly
                size='sm'
                variant='ghost'
                className={classNames(toolButtonClass, 'relative')}
                title={chat.open ? 'Hide chat' : 'Show chat'}
                aria-expanded={chat.open}
                onPress={chat.onToggle}
            >
                <FontAwesomeIcon
                    icon={chat.open ? faCommentSlash : faComment}
                    className='text-base'
                />
                {!chat.open && chat.unread > 0 && (
                    <span className='absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-ink'>
                        {chat.unread > 99 ? '99+' : chat.unread}
                    </span>
                )}
            </Button>
        );
    // Phones have the view mode in the menu instead
    const followToggle = melee && !phoneLayout && (
        <Button
            size='sm'
            variant='ghost'
            data-follow={followed.paused ? 'manual' : 'directed'}
            className={classNames(
                'h-full min-w-0 gap-1.5 rounded-none px-2.5 text-sm',
                followed.paused ? 'bg-gold/25 text-gold' : 'text-ink'
            )}
            title={
                followed.paused
                    ? 'View: manual. Tap to follow the action.'
                    : 'View: directed, following the action. Tap to move it yourself.'
            }
            onPress={followed.paused ? followed.resume : followed.stop}
        >
            <FontAwesomeIcon icon={faVideo} className='text-base' />
            {followed.paused ? 'Free' : 'Auto'}
        </Button>
    );
    // room: what our stats leave in the desktop's joust bar, for menu items shown as buttons. before: beside the menu's
    // button. A desktop always shows the game's result as a button.
    const gameMenu = (room, before) => (
        <GameMenu
            isPlaying={isPlaying}
            onSettingsClick={onSettingsClick}
            onShortcutsClick={onShortcutsClick}
            room={room}
            view={melee && phoneLayout ? followed : undefined}
            pinned={phoneLayout ? undefined : ['result']}
            before={before}
        />
    );

    // Phones: at the top of the screen, so the open chat leaves its button in view (portrait: the chat starts below
    // them; landscape: they float over it)
    const screenTools = (
        <>
            <FullscreenToggle />
            {chatButton()}
        </>
    );
    // Melee: tools in a corner of the view, lined up with the seat bars (h-9 or h-10). Solid, as the stats of boards
    // further along the row run under them.
    const cornerTools = (edge, props, children) => (
        <div
            {...props}
            className={classNames(
                'pointer-events-none absolute right-0 z-246 box-content flex hud-zoom',
                portrait ? 'h-9' : 'h-10',
                edge === 'top' ? 'top-0 pt-(--safe-top)' : 'bottom-0 pb-(--safe-bottom)'
            )}
        >
            <ToolGroup inBar solid>
                {children}
            </ToolGroup>
        </div>
    );
    // Portrait keeps only the menu at the bottom (full screen and the chat are at the top)
    const barTools =
        melee &&
        !short &&
        cornerTools(
            'bottom',
            { 'data-region': 'tools' },
            portrait ? (
                gameMenu(0)
            ) : (
                <>
                    {gameMenu(0, followToggle)}
                    {chatButton()}
                </>
            )
        );
    const topTools =
        portrait &&
        melee &&
        cornerTools('top', { 'data-region': 'top-tools', 'data-chat-anchor': '' }, screenTools);
    const promptBar = (barMode, className, stackOptions = false) => (
        <PromptBar
            className={className}
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
            showLog={!chat.open}
            shortcuts={floatingPrompt}
        />
    );

    // The line between the play areas, as the layout measures it. Elsewhere the line is the middle of the view.
    const divider = floatingPrompt ? (
        <div
            ref={dividerRef}
            data-region='mid'
            aria-hidden
            className='pointer-events-none sticky left-0 h-0 shrink-0'
        />
    ) : null;
    // Desktop: the prompt is at the foot of the bottom row's play area on its side (Room)
    const floatingPanel = floatingPrompt && (
        <div
            data-region='prompt-float'
            style={{
                width: 'var(--board-prompt-width)',
                // --text-scale carries the interface's scale too (interfaceScaleProperties)
                '--ui-scale': `calc(var(--text-scale, 1) * ${promptBoost})`
            }}
        >
            {promptBar(
                'panel',
                'rounded-r-md border border-l-0 shadow-[0_6px_18px_rgba(0,0,0,0.6)]',
                true
            )}
        </div>
    );
    const midline = !floatingPrompt && (
        <div
            ref={dividerRef}
            data-region='mid'
            aria-hidden
            className='pointer-events-none absolute inset-x-0 top-1/2 h-0'
        />
    );

    // Publishes overlay positions as CSS variables on :root, for what lies over the board (the docked prompt's panel,
    // the prompt's column)
    const topBarsRef = useRef(null);
    useLayoutEffect(() => {
        const divider = dividerRef.current;
        if (!divider) {
            return;
        }
        const root = document.documentElement;
        const written = {};
        // Every position is read before any is written, and only changes are written, so it lays out once
        const place = () => {
            const rectOf = (selector) =>
                boardRef.current?.querySelector(selector)?.getBoundingClientRect();
            const height = window.innerHeight;
            const tools = rectOf('[data-region="tools"]');
            const topRail = rectOf('[data-rail-side="top"]');
            const bottomRail = rectOf('[data-rail-side="bottom"]');
            // Outside the board in phone landscape, floating over it
            const topTools = document
                .querySelector('[data-region="top-tools"]')
                ?.getBoundingClientRect();
            // Where a phone's chat starts: below the bar holding its button, from the chat's own container
            const chatAnchor = document
                .querySelector('[data-chat-anchor]')
                ?.getBoundingClientRect();
            const chatBase =
                document.querySelector('.chat-drawer')?.offsetParent?.getBoundingClientRect().top ??
                0;
            const values = {
                '--board-divider-bottom': divider.getBoundingClientRect().bottom,
                '--board-tools-width': tools ? tools.width : 0,
                '--board-top-tools-width': topTools ? topTools.width : 0,
                '--board-chat-top': chatAnchor ? Math.max(0, chatAnchor.bottom - chatBase) : 0,
                '--board-rail-top': topRail ? topRail.bottom : 0,
                '--board-rail-bottom': bottomRail ? height - bottomRail.top : 0
            };
            for (const [name, value] of Object.entries(values)) {
                if (written[name] !== value) {
                    written[name] = value;
                    root.style.setProperty(name, `${value}px`);
                }
            }
        };
        let frame = 0;
        const placeSoon = () => {
            frame ||= requestAnimationFrame(() => {
                frame = 0;
                place();
            });
        };
        place();
        const observer = new ResizeObserver(place);
        observer.observe(divider);
        observer.observe(document.body);
        [
            topBarsRef.current,
            columnRef.current,
            boardRef.current?.querySelector('[data-region="tools"]'),
            document.querySelector('[data-chat-anchor]'),
            boardRef.current?.querySelector('[data-board-scroll]'),
            document.querySelector('[data-prompt-bar]'),
            boardRef.current?.querySelector('[data-side="top"]'),
            ...(boardRef.current?.querySelectorAll('[data-region="stats-rail"]') ?? [])
        ].forEach((element) => element && observer.observe(element));
        window.addEventListener('resize', place);
        // The stats in phone landscape move with the board as it scrolls
        const scroller = boardRef.current?.querySelector('[data-board-scroll] [data-clips]');
        scroller?.addEventListener('scroll', placeSoon, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('resize', place);
            scroller?.removeEventListener('scroll', placeSoon);
            Object.keys(written).forEach((name) => root.style.removeProperty(name));
        };
    }, [mode]);

    const opponents = otherPlayers.map((player) => (
        <div
            key={player.name ?? player.seatNo}
            className='flex flex-1 border-b border-white/4.5'
            style={sideFlex.top}
        >
            {renderSide(player, 'top')}
        </div>
    ));
    const ours = (
        <div className='flex flex-1' style={sideFlex.bottom}>
            {renderSide(thisPlayer, 'bottom', { prompt: true })}
        </div>
    );
    const handTray = handTrayShown && (
        <div
            data-region='hand-tray'
            className={classNames('shrink-0 bg-black/40 px-1 pb-1 pt-2', {
                [waitedOnBand]: melee && thisPlayer?.isActivePrompt
            })}
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

    // Melee: two rows of boards, us at the bottom left. The desktop prompt's room is a column at each side, which only
    // the end boards' play areas keep clear of.
    const table = melee
        ? (() => {
              const rows = tableRows(thisPlayer, [thisPlayer, ...otherPlayers]);
              const columns = Math.max(rows.top.length, rows.bottom.length);
              const cell = (player, side, index) => (
                  <div
                      key={player.user?.username ?? player.seatNo}
                      data-seat={player.user?.username}
                      className={classNames('flex border-white/4.5', {
                          'border-l': index > 0,
                          'border-b': side === 'top'
                      })}
                      style={{
                          gridColumn: `${index === 0 ? 1 : index + 2} / ${index === columns - 1 ? columns + 3 : index + 3}`,
                          gridRow: side === 'top' ? 1 : floatingPrompt ? 3 : 2,
                          '--board-cover-left': index === 0 ? cover : '0px'
                      }}
                  >
                      {renderSide(player, side, {
                          seat: index,
                          below: player === thisPlayer ? handTray : null,
                          prompt: side === 'bottom' && index === 0
                      })}
                  </div>
              );
              return (
                  <div
                      data-melee-table=''
                      className='relative grid min-h-full flex-1'
                      style={{
                          gridTemplateColumns: `${cover} repeat(${columns}, auto) 0px`,
                          // auto, not fr: equal rows would stretch the top row to ours, opening gaps in the
                          // opponents' play areas. The prompt's row takes no height.
                          gridTemplateRows: floatingPrompt ? 'auto 0px auto' : 'auto auto',
                          '--board-cover-left': '0px'
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
        <>
            {/* A desktop opens each pile in a panel of its own; phones in a sheet */}
            <PopupHostContext.Provider value={phoneLayout ? 'sheet' : 'panel'}>
                <AreaLabelContext.Provider value={phoneLayout ? 'inspect' : 'full'}>
                    <div
                        data-layout={mode}
                        className='relative flex h-full w-full overflow-hidden'
                        style={{
                            '--board-prompt-width': floatingPromptWidth,
                            '--board-cover-left': cover
                        }}
                    >
                        {short && (
                            <div
                                data-region='prompt-column'
                                className={classNames(
                                    'pointer-events-none absolute z-305 flex flex-col pb-[calc(var(--board-rail-bottom,0px)+0.25rem)] pt-[calc(var(--board-rail-top,0px)+0.25rem)]',
                                    'bottom-0 left-0 top-0 pl-[env(safe-area-inset-left)]'
                                )}
                                style={{ width: columnWidth }}
                            >
                                {/* Auto margins, unlike centring, keep its top in reach once it scrolls */}
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
                                            'rounded-md border shadow-[0_6px_18px_rgba(0,0,0,0.6)]'
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {short && (
                            <>
                                {/* Over the open chat, which covers the whole screen, so its button closes it */}
                                <div
                                    data-region='top-tools'
                                    className={classNames(
                                        'pointer-events-none absolute right-[calc(env(safe-area-inset-right)+0.25rem)] top-[calc(var(--safe-top)+0.25rem)] flex',
                                        chat?.open ? 'z-361' : 'z-305'
                                    )}
                                >
                                    <ToolGroup zoom className='h-8'>
                                        {screenTools}
                                    </ToolGroup>
                                </div>
                                <div className='pointer-events-none absolute bottom-[calc(var(--safe-bottom)+0.25rem)] right-[calc(env(safe-area-inset-right)+0.25rem)] z-305 flex'>
                                    <ToolGroup zoom data-region='tools' className='h-8'>
                                        {gameMenu(0)}
                                    </ToolGroup>
                                </div>
                            </>
                        )}
                        <div ref={boardRef} className='flex min-w-0 flex-1 flex-col'>
                            {!short && !melee && (
                                <div
                                    ref={topBarsRef}
                                    data-sheet-edge={portrait ? 'top' : undefined}
                                    data-chat-anchor={portrait ? '' : undefined}
                                    className='relative z-305 shrink-0'
                                >
                                    {otherPlayers.map((player, index) => (
                                        <EdgeStatsBar
                                            key={player.name ?? player.seatNo}
                                            player={player}
                                            compact={phoneLayout}
                                            edge='top'
                                        >
                                            {portrait && index === 0 && (
                                                <ToolGroup inBar className='h-full'>
                                                    {screenTools}
                                                </ToolGroup>
                                            )}
                                        </EdgeStatsBar>
                                    ))}
                                </div>
                            )}
                            <div
                                className={classNames('flex min-h-0 flex-1 flex-col', {
                                    'pl-[env(safe-area-inset-left)]': !short,
                                    'pr-[env(safe-area-inset-right)]': true,
                                    'pb-(--safe-bottom) pt-(--safe-top)': short
                                })}
                            >
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
                                        <div
                                            data-flight-layer=''
                                            aria-hidden
                                            className='pointer-events-none absolute inset-0 z-290'
                                        />
                                    </ScrollArea>
                                    {midline}
                                    {barTools}
                                    {topTools}
                                </div>
                            </div>
                            {!short && !melee && (
                                <div
                                    data-sheet-edge={portrait ? 'bottom' : undefined}
                                    data-region='tools'
                                    className='relative z-306 shrink-0'
                                >
                                    {/* In portrait the prompt lies below, clear of the screen's bottom edge */}
                                    <EdgeStatsBar
                                        player={thisPlayer}
                                        canChange={canChangeStats}
                                        compact={phoneLayout}
                                        edge='bottom'
                                        className={classNames({ 'pb-0!': portrait })}
                                    >
                                        {(room) => (
                                            <ToolGroup inBar className='h-full'>
                                                {portrait ? (
                                                    gameMenu(0)
                                                ) : (
                                                    <>
                                                        {gameMenu(
                                                            Math.max(0, room - chatButtonRoom)
                                                        )}
                                                        {chatButton()}
                                                    </>
                                                )}
                                            </ToolGroup>
                                        )}
                                    </EdgeStatsBar>
                                </div>
                            )}
                            {portrait && promptBar('dock')}
                        </div>
                        <BoardOverlays
                            thisPlayer={thisPlayer}
                            otherPlayers={otherPlayers}
                            isPlaying={isPlaying}
                            buttons={userPlayer?.buttons}
                            onButtonClick={onButtonClick}
                        />
                    </div>
                    <SheetHost mode={mode} />
                    <ConnectionLost />
                </AreaLabelContext.Provider>
            </PopupHostContext.Provider>
        </>
    );
};

export default AdaptiveGameBoardLayout;
