import React, { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Avatar, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
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
    <Popover placement={placement} offset={6} showArrow>
        <PopoverTrigger>
            <button
                type='button'
                className='flex h-full items-center rounded-md data-[pressed=true]:bg-white/10'
            >
                {display(false, true)}
            </button>
        </PopoverTrigger>
        <PopoverContent className='border border-default-200 bg-black/90 p-1 hud-zoom'>
            <div className='flex h-8 items-center'>{display(true, false)}</div>
        </PopoverContent>
    </Popover>
);

// How wide the stats are, and how much of the bar is left beside them, as the bar or the stats change size
const useRoomBeside = (barRef, statsRef, avatarRef, enabled) => {
    const [room, setRoom] = useState(0);
    useLayoutEffect(() => {
        const bar = barRef.current;
        const stats = statsRef.current;
        if (!enabled || !bar || !stats) {
            return;
        }
        const measure = () => {
            const padding =
                parseFloat(getComputedStyle(bar).paddingLeft) +
                parseFloat(getComputedStyle(bar).paddingRight);
            // The stats' own width, not their box's, which stretches into whatever is spare
            const content = [...stats.children].reduce(
                (sum, child) => sum + child.offsetWidth,
                avatarRef.current?.offsetWidth ?? 0
            );
            const next = Math.max(0, bar.clientWidth - padding - content);
            setRoom((current) => (Math.abs(current - next) < 1 ? current : next));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(bar);
        [...stats.children].forEach((child) => observer.observe(child));
        return () => observer.disconnect();
    });
    return room;
};

// A player's avatar and stats, as a bar or (vertical) a stack. In manual mode our own stats get +/- as in classic.
// children: kept at the bar's far end; as a function it is given the room the stats leave.
// columns/mirrored: the stack's items per row, and drawn upside down for the player above the prompt.
// showSeat: a seat-number badge on the avatar, at a melee table.
const PlayerStatsBar = ({
    player,
    vertical = false,
    columns = 1,
    mirrored = false,
    compact = false,
    canChange = false,
    showSeat = false,
    edge,
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
    const end = typeof children === 'function' ? children(vertical ? 0 : room) : children;
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
        />
    );

    return (
        <div
            ref={barRef}
            data-stats-bar={username}
            style={grid ? { gridTemplateColumns: `repeat(${columns}, auto)` } : undefined}
            className={classNames(
                'hud-zoom items-center bg-black/60',
                grid
                    ? 'grid min-h-0 shrink justify-center justify-items-center gap-x-1.5 px-0.5'
                    : vertical
                      ? classNames(
                            'flex min-h-0 shrink px-0.5',
                            mirrored ? 'flex-col-reverse' : 'flex-col'
                        )
                      : classNames(
                            // At the top or bottom of the screen the bar reaches the edge, its own background
                            // filling any notch or gesture area, and its contents sit clear of it. It lies over the
                            // cards (so the avatar reaching out of it is never hidden), under the divider and its panel.
                            'relative z-[245] box-content flex shrink-0 border-default-100 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]',
                            compact ? 'h-7' : 'h-8',
                            {
                                'pt-[var(--safe-top)]': edge === 'top',
                                'pb-[var(--safe-bottom)]': edge === 'bottom'
                            }
                        ),
                className
            )}
        >
            <div
                ref={avatarRef}
                style={placeOf(0)}
                className={classNames(
                    'relative shrink-0',
                    vertical ? 'px-1 py-1.5' : classNames('h-full', compact ? 'w-10' : 'w-11')
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
                    <Avatar
                        src={username ? `/img/avatar/${username}.png` : undefined}
                        showFallback
                        name={username}
                        className={classNames(
                            'shadow-[0_2px_6px_rgba(0,0,0,0.6)]',
                            vertical
                                ? 'h-6 w-6 text-tiny'
                                : compact
                                  ? 'h-8 w-8 text-tiny'
                                  : 'h-9 w-9',
                            { 'ring-2 ring-warning': player.firstPlayer }
                        )}
                    />
                    {showSeat && player.seatNo !== undefined && (
                        <span
                            title={`Seat ${player.seatNo}`}
                            className='absolute -left-1.5 -top-0.5 rounded-full border border-zinc-400 bg-zinc-800 px-1 text-[9px] font-bold leading-tight text-zinc-100'
                        >
                            {player.seatNo}
                        </span>
                    )}
                    {player.firstPlayer && (
                        <span className='absolute -bottom-0.5 -right-1.5 rounded-full bg-warning px-1 text-[9px] font-bold leading-tight text-black'>
                            1st
                        </span>
                    )}
                </span>
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
                          : 'flex h-full min-w-0 flex-1 items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&>*]:shrink-0'
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
                        grid ? 'flex-row justify-center' : vertical ? 'mt-auto flex-col' : 'pl-1'
                    )}
                >
                    {end}
                </div>
            )}
        </div>
    );
};

export default PlayerStatsBar;
