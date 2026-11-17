import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faXmark } from '@fortawesome/free-solid-svg-icons';

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
import ScoreBadge from './ScoreBadge';
import PlotFactionStack from './PlotFactionStack';
import PileCluster from './PileCluster';
import HandTray from './HandTray';
import OpponentCarousel from './OpponentCarousel';
import ScrollArea from './ScrollArea';
import PromptBar from './PromptBar';

// One player's side of the board, as a grid of its parts: "id" (plots, agenda and faction), "hand" (the
// opponent's hand, or ours on a wide board), "piles" and "play". Ours mirrors the opponent's, play area nearest
// the middle.
const sideAreas = {
    narrow: {
        top: { columns: 'minmax(0, 1fr)', rows: ['strip', 'play'] },
        bottom: { columns: 'minmax(0, 1fr)', rows: ['play', 'strip'] }
    },
    short: {
        top: { columns: 'auto minmax(0, 1fr) auto', rows: ['id play hand', 'id play piles'] },
        bottom: { columns: 'auto minmax(0, 1fr) auto', rows: ['id play piles', 'id play piles'] }
    },
    wide: {
        top: { columns: 'auto auto minmax(0, 1fr)', rows: ['id hand piles', 'play play play'] },
        bottom: { columns: 'auto auto minmax(0, 1fr)', rows: ['play play play', 'id hand piles'] }
    }
};

const sideGridStyle = (mode, side) => {
    const { columns, rows } = sideAreas[mode][side];
    const playRow = rows.findIndex((row) => row.includes('play') && !row.includes('id'));
    return {
        gridTemplateColumns: columns,
        gridTemplateRows: rows
            .map((row, index) =>
                index === playRow || (mode === 'short' && index === (side === 'top' ? 1 : 0))
                    ? 'minmax(0, 1fr)'
                    : 'auto'
            )
            .join(' '),
        gridTemplateAreas: rows.map((row) => `"${row}"`).join(' ')
    };
};

// A part drawn at another of the board's scales: every card size inside follows --card-scale
const Part = ({ area, scale, className, children }) => (
    <div
        data-region={area}
        className={classNames('relative min-w-0 min-h-0', className)}
        style={{ gridArea: area, ...(scale && { '--card-scale': `var(--${scale}-scale)` }) }}
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
            .querySelectorAll('[data-side] > [data-region]:not([data-region="play"])')
            .forEach((part) => observer.observe(part));
        board.querySelectorAll('[data-side]').forEach((side) => observer.observe(side));
        return () => observer.disconnect();
    }, [boardRef, mode]);
    return {
        top: { flex: `1 1 ${chrome.top}px` },
        bottom: { flex: `1 1 ${chrome.bottom}px` }
    };
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
    const boardRef = useRef(null);
    const sideFlex = useEqualPlayAreas(boardRef, mode);
    const manualMode = useSelector((state) => !!state.lobby.currentGame?.manualMode);
    const username = useSelector((state) => state.auth.user?.username);
    const isPlaying = !!thisPlayer && thisPlayer.user?.username === username;
    const phoneLayout = mode !== 'wide';
    // A tablet laid out wide is still touched, so its piles open in sheets too
    const coarsePointer = useMemo(
        () => window.matchMedia?.('(pointer: coarse)').matches ?? false,
        []
    );
    const pileScale = phoneLayout ? 'pile' : null;

    const renderSide = (player, side) => {
        const isMe = !!thisPlayer && player === thisPlayer;
        const pileProps = {
            onCardClick,
            popupLocation: side,
            popupId: side,
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
        const handInStrip = !isMe || mode === 'wide';

        // Plots, agenda and faction, the opponent's hand, and the piles: in portrait they share one strip, which
        // wraps onto a second line when it is wider than the board
        const stripParts = (
            <>
                <Part area='id' scale={pileScale} className='p-1'>
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
                        scale={isMe ? null : pileScale}
                        className={classNames('p-1', { 'justify-self-end': mode === 'short' })}
                    >
                        {droppable(
                            'hand',
                            <SquishableCardPanel
                                cards={withoutPendingAttachment(player.cardPiles.hand)}
                                groupVisibleCards
                                maxCards={isMe ? 5 : 1}
                                onCardClick={onCardClick}
                                source='hand'
                                title='Hand'
                                flipFrom={player.user?.username}
                                stagedArrivals={isMe}
                                redeal={player.phase === 'setup'}
                            />
                        )}
                    </Part>
                )}
                <Part
                    area='piles'
                    scale={pileScale}
                    className={classNames('p-1 flex', {
                        'justify-end': mode !== 'wide',
                        'items-end': mode === 'short' && side === 'bottom'
                    })}
                >
                    <PileCluster
                        player={player}
                        isMe={isMe}
                        side={side}
                        spectating={!thisPlayer}
                        onCardClick={onCardClick}
                        pileProps={pileProps}
                        droppable={droppable}
                        isDragging={isDragging}
                    />
                </Part>
            </>
        );

        return (
            <div
                data-side={side}
                className='grid h-full w-full min-h-0 min-w-0'
                style={sideGridStyle(mode, side)}
            >
                {mode === 'narrow' ? (
                    <div
                        data-region='strip'
                        className='flex flex-wrap items-start justify-between [&>*]:p-0.5'
                        style={{ gridArea: 'strip' }}
                    >
                        {stripParts}
                    </div>
                ) : (
                    stripParts
                )}
                <Part area='play' className='flex'>
                    <ScrollArea className='flex-1' anchor={side === 'top' ? 'end' : 'start'}>
                        <PlayerBoard
                            isDroppable={isMe}
                            cardsInPlay={player.cardPiles.cardsInPlay}
                            pendingAttachment={findPendingAttachment(player.cardPiles)}
                            leftBehind={findLeftBehind(player.cardPiles)}
                            onCardClick={onCardClick}
                            rowDirection={side === 'bottom' ? 'default' : 'reverse'}
                            overflow='wrap'
                        />
                    </ScrollArea>
                </Part>
            </div>
        );
    };

    const onButtonClick = (button) =>
        dispatch(
            sendButtonClickedMessage(button.promptId, button.command, button.method, button.arg)
        );
    const gameActions = (
        <div className='flex items-center'>
            {phoneLayout && chat && (
                <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    className='relative h-7 w-7 min-w-7 overflow-visible'
                    title={chat.open ? 'Hide chat' : 'Show chat'}
                    aria-expanded={chat.open}
                    onPress={chat.onToggle}
                >
                    <FontAwesomeIcon icon={chat.open ? faXmark : faComment} />
                    {!chat.open && chat.unread > 0 && (
                        <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white'>
                            {chat.unread > 99 ? '99+' : chat.unread}
                        </span>
                    )}
                </Button>
            )}
            <GameMenu
                isPlaying={isPlaying}
                onSettingsClick={onSettingsClick}
                onShortcutsClick={onShortcutsClick}
            />
        </div>
    );

    // The divider is the scoreboard: each player's power and gold at their end of it
    const divider = (
        <div ref={dividerRef} data-region='mid' className='relative z-[250] shrink-0'>
            <PromptBar
                mode={mode}
                phase={thisPlayer?.phase}
                promptTitle={userPlayer?.promptTitle}
                promptText={userPlayer?.menuTitle}
                buttons={userPlayer?.buttons}
                controls={userPlayer?.controls}
                selecting={!!userPlayer?.selectCard}
                onButtonClick={onButtonClick}
                timer={<GameTimer player={thisPlayer} isMe={!!thisPlayer} side='bottom' />}
                actions={gameActions}
                startOfTrack={
                    <div className='flex gap-3'>
                        {otherPlayers.map((player) => (
                            <ScoreBadge
                                key={player.name ?? player.seatNo}
                                player={player}
                                showName={mode === 'wide'}
                            />
                        ))}
                    </div>
                }
                endOfTrack={
                    <ScoreBadge
                        player={thisPlayer}
                        align='end'
                        showName={mode === 'wide'}
                        canChange={isPlaying && manualMode}
                    />
                }
            />
        </div>
    );

    // On a phone the chat drops down to the divider, and no further
    useLayoutEffect(() => {
        const divider = dividerRef.current;
        const host = divider?.closest('[data-layout]')?.parentElement;
        if (!phoneLayout || !divider || !host) {
            return;
        }
        const root = document.documentElement;
        const place = () =>
            root.style.setProperty(
                '--chat-open-height',
                `${divider.getBoundingClientRect().top - host.getBoundingClientRect().top}px`
            );
        place();
        const observer = new ResizeObserver(place);
        observer.observe(divider);
        observer.observe(host);
        return () => {
            observer.disconnect();
            root.style.removeProperty('--chat-open-height');
        };
    }, [phoneLayout]);

    const opponents = (
        <OpponentCarousel
            className='flex-1'
            style={sideFlex.top}
            opponents={otherPlayers}
            renderSide={(player) => renderSide(player, 'top')}
        />
    );
    const ours = (
        <div className='flex min-h-0 flex-1' style={sideFlex.bottom}>
            {renderSide(thisPlayer, 'bottom')}
        </div>
    );
    const handTray = phoneLayout && thisPlayer && (
        <div
            data-region='hand-tray'
            className='shrink-0 p-1'
            style={{ '--card-scale': 'var(--hand-scale)' }}
        >
            <HandTray
                player={thisPlayer}
                onCardClick={onCardClick}
                peek={mode === 'short'}
                droppable={(source, children, count, className) => (
                    <Droppable source={source} className={className}>
                        {children}
                    </Droppable>
                )}
            />
        </div>
    );

    return (
        <PopupHostContext.Provider value={phoneLayout || coarsePointer ? 'sheet' : 'panel'}>
            <AreaLabelContext.Provider value={phoneLayout ? 'caption' : 'full'}>
                <div
                    ref={boardRef}
                    data-layout={mode}
                    className='flex h-full w-full flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
                >
                    {opponents}
                    {divider}
                    {ours}
                    {handTray}
                </div>
            </AreaLabelContext.Provider>
        </PopupHostContext.Provider>
    );
};

export default AdaptiveGameBoardLayout;
