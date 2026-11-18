import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCommentSlash } from '@fortawesome/free-solid-svg-icons';

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

// A part drawn at another of the board's scales: every card size inside follows --card-scale
const Part = ({ area, scale, className, children }) => (
    <div
        data-region={area}
        className={classNames('relative min-w-0 min-h-0', className)}
        style={scale ? { '--card-scale': `var(--${scale}-scale)` } : undefined}
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

// How wide the prompt is as a panel over the side of the play areas (on a desktop): like classic's, following the
// interface size
const floatingPromptWidth = 'calc(var(--ui-scale, 1) * clamp(12rem, 20vw, 16rem))';
// On the right it keeps clear of the chat's tab, which reaches over the board's right edge
const chatTabDepth = 'calc(var(--ui-scale, 1) * 1.75rem)';
// The column down one side of the screen in phone landscape: the players' stats at its top and bottom, the prompt
// and our tools between them. The board starts where it ends, and runs on under it once scrolled.
const columnWidth = 'clamp(13rem, 30vw, 20rem)';

// Room at the start and end of a play area for what lies over the board's sides (the prompt), so its cards only go
// under that once scrolled
const Room = ({ width }) => <div aria-hidden className='shrink-0' style={{ width }} />;
const coverBefore = 'var(--board-cover-left, 0px)';
const coverAfter = 'var(--board-cover-right, 0px)';

// Characters and locations take a row each, except in phone landscape, where there is height for only one and
// they share it. The whole board scrolls as one, both ways, so a play area is as tall as its cards.
const PlayArea = ({ inline, children }) => (
    <Part area='play' className='flex flex-1 !min-h-[auto]'>
        <Room width={coverBefore} />
        {children(inline ? 'inline' : 'nowrap')}
        <Room width={coverAfter} />
    </Part>
);

// A row drawn smaller, as a whole, when it is wider than the room it has. It sets the interface's size for what is
// inside it, which every part of a stats bar follows.
const FitRow = ({ className, children }) => {
    const outerRef = useRef(null);
    const innerRef = useRef(null);
    const fitRef = useRef(1);
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
            const natural = inner.getBoundingClientRect().width / fitRef.current;
            const fit = natural > 0 ? Math.min(1, outer.clientWidth / natural) : 1;
            if (Math.abs(fit - fitRef.current) > 0.01 || scale?.ui !== ui) {
                fitRef.current = fit;
                setScale({ ui, fit });
            }
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(outer);
        observer.observe(inner);
        return () => observer.disconnect();
    });
    return (
        <div
            ref={outerRef}
            className={classNames('flex min-w-0 justify-center overflow-hidden', className)}
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
    // At a melee table the view follows the action, unless turned off in the HUD settings
    const followed = useAutoFollow({
        boardRef,
        target: followTarget(thisPlayer, otherPlayers),
        active: activePlayerOf(thisPlayer, otherPlayers),
        enabled: melee && hud.followAction !== false,
        waiting: isDragging
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
        const hand = withoutPendingAttachment(player.cardPiles.hand);
        const shadows = withoutPendingAttachment(player.cardPiles.shadows);
        // The opponent's hand fans out over their half when tapped or chosen from
        const fanned = (panel) =>
            side === 'top' ? (
                <HandFan cards={hand} playerName={player.user?.username} onCardClick={onCardClick}>
                    {panel}
                </HandFan>
            ) : (
                panel
            );

        // Plots, agenda and faction, the hand, and the piles, in one row, which scrolls sideways with the rest of the
        // board and never gives up height. A dark band with a thin edge on the play area's side, so cards scrolling
        // under it end on a clean line.
        const strip = (
            <div
                data-region='strip'
                className={classNames(
                    'flex shrink-0 flex-nowrap items-start bg-black/40 px-1',
                    portrait
                        ? 'gap-1 py-2'
                        : short
                          ? // A card raised in our hand needs room above it in the strip, which clips what spills out
                            classNames('gap-2 pb-1', {
                                'pt-[calc(var(--pile-scale,1)*0.75rem+0.25rem)]': isMe,
                                'pt-1': !isMe
                            })
                          : 'gap-2 py-3',
                    side === 'top'
                        ? 'border-b border-default-200/40'
                        : 'border-t border-default-200/40'
                )}
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
                            isMe
                                ? 'shrink-0'
                                : 'min-w-[calc(var(--card-scale,1)*4.4rem)] shrink grow-0 basis-[calc(var(--card-scale,1)*12rem)]'
                        }
                    >
                        {fanned(
                            droppable(
                                'hand',
                                <SquishableCardPanel
                                    cards={hand}
                                    groupVisibleCards
                                    fitWidth={!isMe}
                                    maxCards={isMe ? 5 : 3}
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
                <Part
                    area='piles'
                    scale={pileScale}
                    className={classNames('flex shrink-0', { 'ml-auto': portrait })}
                >
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
            <PlayArea inline={short}>
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

        // In phone landscape the player's stats are a row at the top (the opponent's) or bottom (ours) of the column
        // down the screen's side. The column belongs to each board, so the board starts beside it, and its stats keep
        // to their own board: at the screen's side as the board scrolls sideways, and at the board's edge as it
        // scrolls up and down.
        const rail = short && (
            <div
                className={classNames(
                    'pointer-events-none sticky z-[300] flex shrink-0 flex-col',
                    promptSide === 'right' ? 'right-0' : 'left-0',
                    side === 'top' ? 'justify-start' : 'justify-end'
                )}
                style={{ width: columnWidth }}
            >
                <div
                    data-region='stats-rail'
                    data-rail-side={side}
                    className={classNames(
                        'pointer-events-auto sticky m-1 rounded-md border border-default-200/40 bg-black/60 shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
                        side === 'top' ? 'top-1' : 'bottom-1'
                    )}
                >
                    <FitRow className='px-1'>
                        <PlayerStatsBar
                            player={player}
                            vertical
                            columns={6}
                            compact
                            canChange={isMe && canChangeStats}
                            className='bg-transparent'
                        />
                    </FitRow>
                </div>
            </div>
        );

        // At a melee table each player's stats bar is on their own board's outer edge, staying in view as the board
        // scrolls: at the board's top or bottom as it scrolls up and down, and along the view as it scrolls sideways
        const seatBar = melee && !short && (
            <div
                className={classNames(
                    'sticky z-[245] shrink-0',
                    side === 'top' ? 'top-0' : 'bottom-0'
                )}
            >
                <PlayerStatsBar
                    player={player}
                    compact={phoneLayout}
                    canChange={isMe && canChangeStats}
                    className={classNames(
                        'sticky left-0 w-[min(100%,var(--scroll-view-width,100%))]',
                        side === 'top' ? 'border-b' : 'border-t',
                        { 'bg-sky-950/80': player.isActivePrompt }
                    )}
                />
            </div>
        );

        return (
            <div
                data-side={side}
                data-player={player.user?.username}
                className={classNames('flex w-full flex-1', {
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
    // On a phone the chat opens under the opponent's bar (beside the prompt's column in landscape), which stays above
    // it, so its button stays in the same place, open or closed
    const chatButton = phoneLayout && chat && (
        <Button
            isIconOnly
            size='sm'
            variant='light'
            className='relative h-7 w-7 min-w-7 overflow-visible'
            title={chat.open ? 'Hide chat' : 'Show chat'}
            aria-expanded={chat.open}
            onPress={chat.onToggle}
        >
            <FontAwesomeIcon icon={chat.open ? faCommentSlash : faComment} />
            {!chat.open && chat.unread > 0 && (
                <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white'>
                    {chat.unread > 99 ? '99+' : chat.unread}
                </span>
            )}
        </Button>
    );
    // Our game menu belongs to us, at the end of our own stats
    // Given the room our stats leave, it shows what fits as buttons and keeps the rest in its menu
    // On phone layouts a full-screen toggle stays beside it, out of the menu
    const gameMenu = (room) => (
        <>
            {phoneLayout && <FullscreenToggle />}
            <GameMenu
                isPlaying={isPlaying}
                onSettingsClick={onSettingsClick}
                onShortcutsClick={onShortcutsClick}
                room={phoneLayout ? Math.max(0, room - 28) : room}
            />
        </>
    );

    // At a melee table there is no bar of our own along the screen's edge, so our tools go with the prompt
    const promptBar = (barMode, className, actions) => (
        <PromptBar
            className={className}
            actions={actions}
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
                className={classNames(
                    'absolute top-0 -translate-y-1/2',
                    promptSide === 'right' ? 'right-[var(--board-prompt-inset)]' : 'left-0'
                )}
                style={{ width: 'var(--board-prompt-width)' }}
            >
                {promptBar(
                    'panel',
                    classNames(
                        'border shadow-[0_6px_18px_rgba(0,0,0,0.6)]',
                        promptSide === 'right' ? 'rounded-md' : 'rounded-r-md border-l-0'
                    ),
                    melee ? gameMenu(0) : undefined
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

    // Sheets keep to their own player's half: they stop at the divider's edges (the prompt panel's, on a desktop),
    // and keep clear of the prompt in phone landscape. The phone chat opens below the opponent's bar, or beside the
    // prompt in phone landscape.
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
            const bars = topBarsRef.current?.getBoundingClientRect();
            const column = columnRef.current?.getBoundingClientRect();
            const onRight = promptSide === 'right';
            const width = document.documentElement.clientWidth;
            root.style.setProperty('--board-chat-top', `${bars ? bars.bottom : 0}px`);
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
            root.style.setProperty(
                '--board-sheet-left',
                `${column && !onRight ? column.right : 0}px`
            );
            root.style.setProperty(
                '--board-sheet-right',
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
            document.querySelector('[data-prompt-bar]'),
            boardRef.current?.querySelector('[data-side="top"]'),
            ...(boardRef.current?.querySelectorAll('[data-region="stats-rail"]') ?? [])
        ].forEach((element) => element && observer.observe(element));
        window.addEventListener('resize', place);
        // The desktop's prompt, and the stats in phone landscape, move with the board as it scrolls
        const scroller = boardRef.current?.querySelector('[data-board-scroll] > [data-clips]');
        scroller?.addEventListener('scroll', place, { passive: true });
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', place);
            scroller?.removeEventListener('scroll', place);
            [
                '--board-divider-top',
                '--board-divider-bottom',
                '--board-prompt-bottom',
                '--board-chat-top',
                '--board-chat-left',
                '--board-chat-right',
                '--board-sheet-left',
                '--board-sheet-right',
                '--board-rail-top',
                '--board-rail-bottom'
            ].forEach((name) => root.style.removeProperty(name));
        };
    }, [mode, promptSide]);

    const opponents = otherPlayers.map((player) => (
        <div key={player.name ?? player.seatNo} className='flex flex-1' style={sideFlex.top}>
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

    // A melee table: two rows of boards, a column for each pair, us at the bottom left. On a desktop the prompt's
    // panel lies along the line between the rows. The room kept for the prompt is kept once, as a column at each of
    // the table's sides rather than in every board, so the line between the rows still runs from the screen's edge.
    const table = melee
        ? (() => {
              const rows = tableRows(thisPlayer, [thisPlayer, ...otherPlayers]);
              const columns = Math.max(rows.top.length, rows.bottom.length);
              const cell = (player, side, index) => (
                  <div
                      key={player.user?.username ?? player.seatNo}
                      data-seat={player.user?.username}
                      className={classNames('flex', {
                          'border-l border-default-200/30': index > 0
                      })}
                      style={{
                          gridColumn: index + 2,
                          gridRow: side === 'top' ? 1 : floatingPrompt ? 3 : 2
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
                          gridTemplateRows: floatingPrompt ? '1fr auto 1fr' : '1fr 1fr',
                          '--board-cover-left': '0px',
                          '--board-cover-right': '0px'
                      }}
                  >
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
                            '--board-prompt-inset':
                                floatingPrompt && promptSide === 'right' ? chatTabDepth : '0px',
                            '--board-cover-left': coverOf('left'),
                            '--board-cover-right': coverOf('right'),
                            ...(short && {
                                '--board-edge-left': promptSide === 'left' ? columnWidth : '0px',
                                '--board-edge-right': promptSide === 'right' ? columnWidth : '0px'
                            })
                        }}
                    >
                        {short && (
                            <div
                                className={classNames(
                                    'pointer-events-none absolute z-[305] flex flex-col pb-[calc(var(--board-rail-bottom,0px)+0.25rem)] pt-[calc(var(--board-rail-top,0px)+0.25rem)]',
                                    promptSide === 'right'
                                        ? 'bottom-0 right-0 top-0 pr-[env(safe-area-inset-right)]'
                                        : 'bottom-0 left-0 top-0 pl-[env(safe-area-inset-left)]'
                                )}
                                style={{ width: columnWidth }}
                            >
                                {/* The prompt, between the players' stats */}
                                <div className='flex min-h-0 flex-1 flex-col justify-center px-1'>
                                    <div
                                        ref={columnRef}
                                        data-region='prompt-panel'
                                        className='pointer-events-auto'
                                    >
                                        {promptBar(
                                            'panel',
                                            'rounded-md border shadow-[0_6px_18px_rgba(0,0,0,0.6)]'
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
                                    <div
                                        className={classNames(
                                            'pointer-events-auto flex items-center gap-0.5 rounded-md border border-default-200/40 bg-black/60 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hud-zoom',
                                            { 'flex-row-reverse': promptSide === 'right' }
                                        )}
                                    >
                                        <GameMenu
                                            isPlaying={isPlaying}
                                            onSettingsClick={onSettingsClick}
                                            onShortcutsClick={onShortcutsClick}
                                            room={0}
                                        />
                                        <FullscreenToggle />
                                        {chatButton}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* The bars run to the screen's edges; what lies between them keeps clear of a notch or
                            rounded corners at the sides */}
                        <div ref={boardRef} className='flex min-w-0 flex-1 flex-col'>
                            {!short && !melee && (
                                <div ref={topBarsRef} className='relative z-[305] shrink-0'>
                                    {otherPlayers.map((player, index) => (
                                        <PlayerStatsBar
                                            key={player.name ?? player.seatNo}
                                            player={player}
                                            compact={phoneLayout}
                                            edge='top'
                                            className='border-b'
                                        >
                                            {index === 0 ? chatButton : null}
                                        </PlayerStatsBar>
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
                                        contentClassName='flex-col'
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
                                    </ScrollArea>
                                    {midline}
                                    {followed.paused && (
                                        <button
                                            type='button'
                                            data-follow-resume=''
                                            onClick={followed.resume}
                                            className='absolute left-1/2 top-1 z-[306] -translate-x-1/2 rounded-full border border-default-200/50 bg-black/70 px-2 py-0.5 text-[11px] text-default-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)] hud-zoom hover:text-white'
                                        >
                                            Following paused · tap to resume
                                        </button>
                                    )}
                                </div>
                                {portrait &&
                                    promptBar(
                                        'dock',
                                        undefined,
                                        melee ? (
                                            <>
                                                {chatButton}
                                                {gameMenu(0)}
                                            </>
                                        ) : undefined
                                    )}
                            </div>
                            {!short && !melee && (
                                <PlayerStatsBar
                                    player={thisPlayer}
                                    canChange={canChangeStats}
                                    compact={phoneLayout}
                                    edge='bottom'
                                    className='border-t'
                                >
                                    {gameMenu}
                                </PlayerStatsBar>
                            )}
                        </div>
                    </div>
                    <SheetHost mode={mode} />
                </AreaLabelContext.Provider>
            </PopupHostContext.Provider>
        </AdaptiveBoardContext.Provider>
    );
};

export default AdaptiveGameBoardLayout;
