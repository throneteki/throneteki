import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Popover } from '@heroui/react';
import PlayerAvatar from './PlayerAvatar';
import StatContainer from '../StatContainer';
import StatDisplay from '../StatDisplay';
import { sendChangeStatMessage } from '../../../redux/reducers/game';

// What the bar shows, in classic's order. Power is changed as 'power', the rest by their own name.
const stats = [
    { code: 'totalPower', change: 'power', name: 'Power' },
    { code: 'gold', change: 'gold', name: 'Gold' },
    { code: 'initiative', change: 'initiative', name: 'Initiative' },
    { code: 'claim', change: 'claim', name: 'Claim' },
    { code: 'reserve', change: 'reserve', name: 'Reserve' }
];

// Where the bar has no room for +/- beside every stat (a phone), a stat that can be changed opens them when tapped:
// the stat as the wide bar draws it, with its +/-, in a small panel off the bar's inner edge
const StatChanger = ({ placement, display }) => (
    <Popover>
        <Popover.Trigger className='flex h-full items-center rounded-md data-[pressed=true]:bg-quiet'>
            {display(false, true)}
        </Popover.Trigger>
        <Popover.Content
            placement={placement}
            offset={6}
            className='hud-zoom border border-gold-line bg-panel/95 p-1'
        >
            <Popover.Dialog aria-label='Change stat'>
                <div className='flex h-8 items-center'>{display(true, false)}</div>
            </Popover.Dialog>
        </Popover.Content>
    </Popover>
);

// How wide the stats are, and how much of the bar is left beside them, as the bar or the stats change size
const useRoomBeside = (barRef, statsRef, avatarRef, enabled) => {
    const [room, setRoom] = useState(0);
    const measure = () => {
        const bar = barRef.current;
        const stats = statsRef.current;
        if (!enabled || !bar || !stats) {
            return;
        }
        const style = getComputedStyle(bar);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        // The stats' own width, not their box's, which stretches into whatever is spare
        const content = [...stats.children].reduce(
            (sum, child) => sum + child.offsetWidth,
            avatarRef.current?.offsetWidth ?? 0
        );
        const next = Math.max(0, bar.clientWidth - padding - content);
        setRoom((current) => (Math.abs(current - next) < 1 ? current : next));
    };
    const measureRef = useRef(measure);
    measureRef.current = measure;
    useLayoutEffect(measure);
    useLayoutEffect(() => {
        const bar = barRef.current;
        const stats = statsRef.current;
        if (!enabled || !bar || !stats) {
            return;
        }
        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(bar);
        [...stats.children].forEach((child) => observer.observe(child));
        return () => observer.disconnect();
    }, [enabled, barRef, statsRef]);
    return room;
};

// A player's avatar and stats, as a bar or (vertical) a stack; our own get +/- in manual mode.
// children: at the bar's far end; as a function, given the room the stats leave.
// columns/mirrored: the stack's items per row, upside down for the player above the prompt.
// showSeat: a seat-number badge (melee). backdrop: classes for a band behind a one-row stack, slimmer than its stats.
const PlayerStatsBar = ({
    player,
    vertical = false,
    columns = 1,
    mirrored = false,
    compact = false,
    canChange = false,
    showSeat = false,
    edge,
    backdrop,
    className,
    children
}) => {
    const dispatch = useDispatch();
    const barRef = useRef(null);
    const statsRef = useRef(null);
    const avatarRef = useRef(null);
    const room = useRoomBeside(
        barRef,
        statsRef,
        avatarRef,
        !vertical && typeof children === 'function'
    );
    if (!player) {
        return null;
    }
    const username = player.user?.username;
    const statClass = 'border-none';
    const statHeight = vertical ? 'h-7' : compact ? 'h-6' : 'h-8';
    // In a bar at the screen's edge the stats stand a little proud of it towards the board, as the avatar does
    const reach = vertical ? undefined : { bottom: 'up', top: 'down' }[edge];
    const end = typeof children === 'function' ? children(vertical ? 0 : room) : children;
    const onEdge = !vertical && !!reach;
    const edgeLine = edge === 'bottom' ? 'top-0 -translate-y-1/2' : 'bottom-0 translate-y-1/2';
    const avatarWidth = compact ? '2rem' : '2.25rem';
    const seatBadge = (place) =>
        showSeat &&
        player.seatNo !== undefined && (
            <span
                title={`Seat ${player.seatNo}`}
                className={classNames(
                    'absolute z-10 rounded-full border border-edge bg-banner-idle px-1 text-[10px] font-bold leading-tight text-ink',
                    place
                )}
            >
                {player.seatNo}
            </span>
        );
    const firstBadge = (place, style) =>
        player.firstPlayer && (
            <span
                className={classNames(
                    'absolute z-10 rounded-full bg-warning px-1 text-[10px] font-bold leading-tight text-black',
                    place
                )}
                style={style}
            >
                1st
            </span>
        );
    const changerPlacement = vertical
        ? edge === 'right'
            ? 'left'
            : 'right'
        : edge === 'top'
          ? 'bottom'
          : 'top';
    const grid = vertical && columns > 1;
    // In the grid each item's place: the avatar, then the stats, then the children filling out the last row, in
    // reverse row order when mirrored
    const items = 1 + stats.length;
    const endSpan = columns - (items % columns) || columns;
    const lastRow = Math.ceil((items + (end ? endSpan : 0)) / columns) - 1;
    const placeOf = (index, span = 1) => {
        if (!grid) {
            return undefined;
        }
        const row = Math.floor(index / columns);
        return {
            gridRow: (mirrored ? lastRow - row : row) + 1,
            gridColumn: `${(index % columns) + 1} / span ${span}`
        };
    };
    const statDisplay = (stat, controls, small) => (
        <StatDisplay
            showControls={controls}
            statName={stat.name}
            statCode={stat.code}
            statValue={player.stats?.[stat.code] ?? 0}
            onMinusClick={() => dispatch(sendChangeStatMessage(stat.change, -1))}
            onPlusClick={() => dispatch(sendChangeStatMessage(stat.change, 1))}
            compact={small}
            reach={reach}
            flank
        />
    );

    return (
        <div
            ref={barRef}
            data-stats-bar={username}
            style={grid ? { gridTemplateColumns: `repeat(${columns}, auto)` } : undefined}
            className={classNames(
                'hud-zoom items-center',
                backdrop ? 'relative isolate' : 'bg-panel/90',
                grid
                    ? 'grid min-h-0 shrink justify-center justify-items-center gap-x-1.5 px-0.5'
                    : vertical
                      ? classNames(
                            'flex min-h-0 shrink px-0.5',
                            mirrored ? 'flex-col-reverse' : 'flex-col'
                        )
                      : classNames(
                            // Reaches the screen's edge, its contents clear of a notch or gesture area; above the
                            // cards (so the avatar is never hidden), below the divider
                            'relative z-[245] box-content flex shrink-0 border-edge pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]',
                            compact ? 'h-7' : 'h-8',
                            {
                                'pt-[var(--safe-top)]': edge === 'top',
                                'pb-[var(--safe-bottom)]': edge === 'bottom'
                            }
                        ),
                className
            )}
        >
            {backdrop && (
                <div
                    aria-hidden
                    className={classNames(
                        'pointer-events-none absolute left-4 right-0 top-1/2 -z-10 h-[1.125rem] -translate-y-1/2 rounded-r-md border border-l-0 border-edge shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
                        backdrop
                    )}
                />
            )}
            <div
                ref={avatarRef}
                style={placeOf(0)}
                className={classNames(
                    'relative shrink-0',
                    vertical
                        ? 'px-1 py-1.5'
                        : classNames('h-full', compact ? 'w-[2.625rem]' : 'w-[2.875rem]')
                )}
                title={player.firstPlayer ? `${username} (first player)` : username}
            >
                {/* Larger than the bar, so it reaches out of it towards the board, never past the screen */}
                <span
                    className={classNames(
                        'block',
                        vertical
                            ? 'relative'
                            : classNames('absolute left-0', {
                                  'bottom-0.5': edge === 'bottom',
                                  'top-0.5': edge === 'top',
                                  'top-1/2 -translate-y-1/2': !edge
                              })
                    )}
                >
                    <PlayerAvatar
                        name={username}
                        className={classNames(
                            'shadow-[0_2px_6px_rgba(0,0,0,0.6)]',
                            vertical ? 'h-6 w-6' : compact ? 'h-8 w-8' : 'h-9 w-9',
                            { 'ring-2 ring-warning': player.firstPlayer }
                        )}
                    />
                    {!onEdge && seatBadge('-left-1.5 -top-0.5')}
                    {!onEdge && firstBadge('-bottom-0.5 -right-1.5')}
                </span>
                {/* In a bar at the screen's edge, on the bar's edge towards the board: the seat at the avatar's left,
                    first player at its right, mostly clear of the avatar but short of the screen's edge and the power */}
                {onEdge && seatBadge(classNames('left-0 -translate-x-[45%]', edgeLine))}
                {onEdge &&
                    firstBadge(classNames('-translate-x-1/2', edgeLine), { left: avatarWidth })}
            </div>
            <div
                ref={statsRef}
                className={classNames(
                    grid
                        ? 'contents'
                        : vertical
                          ? classNames(
                                'flex min-h-0 w-full flex-1 items-center overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&>*]:shrink-0',
                                mirrored ? 'flex-col-reverse' : 'flex-col'
                            )
                          : classNames(
                                'flex min-w-0 flex-1 items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&>*]:shrink-0',
                                // Room for them to stand proud of the bar, which the scrolling would clip
                                {
                                    'h-full': !reach,
                                    '-mt-1.5 h-[calc(100%+0.375rem)] pt-1.5': reach === 'up',
                                    '-mb-1.5 h-[calc(100%+0.375rem)] pb-1.5': reach === 'down'
                                }
                            )
                )}
            >
                {!vertical && (
                    <span className='max-w-[8rem] truncate pr-2 font-bold max-md:hidden'>
                        {username || 'Noone'}
                    </span>
                )}
                {stats.map((stat, index) => (
                    <StatContainer
                        key={stat.code}
                        style={placeOf(index + 1)}
                        title={stat.name}
                        className={statClass}
                        height={statHeight}
                    >
                        {canChange && compact ? (
                            <StatChanger
                                placement={changerPlacement}
                                display={(controls, small) => statDisplay(stat, controls, small)}
                            />
                        ) : (
                            statDisplay(stat, canChange, compact)
                        )}
                    </StatContainer>
                ))}
            </div>
            {end && (
                <div
                    style={placeOf(items, endSpan)}
                    className={classNames(
                        'flex shrink-0 items-center',
                        grid
                            ? 'flex-row justify-center'
                            : vertical
                              ? 'mt-auto flex-col'
                              : 'self-stretch pl-1'
                    )}
                >
                    {end}
                </div>
            )}
        </div>
    );
};

export default PlayerStatsBar;
