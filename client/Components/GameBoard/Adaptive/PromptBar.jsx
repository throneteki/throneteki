import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronUp,
    faForwardStep,
    faHandPointer,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import ThronesIcon from '../ThronesIcon';
import CardHoverable from '../../Images/CardHoverable';
import { PromptControls, usePromptActions } from '../usePromptActions';
import PhaseRoll from './PhaseRoll';
import { motionOff } from '../../../flip';
import Messages from '../Messages';
import { logMinimum, useLogFeed } from './useLogFeed';

const fadeTime = 0.3;
// A line too long for its row scrolls along at this speed, after a pause to start reading it
const scrollSpeed = 45;
const scrollPause = 700;
// Hurried, it pauses less, and takes at least this long to scroll
const hurriedPause = 250;
const hurriedScroll = 400;

// A log line, on one line: when it does not fit, it scrolls along once to its end, and asks to be shown for as long
// as that takes. While other lines wait (hurry) it scrolls faster, to be done close to the least time a line shows.
const LogText = ({ entry, hurry, onHold }) => {
    const boxRef = useRef(null);
    const textRef = useRef(null);
    const run = useRef(null);
    const hurryRef = useRef(hurry);
    hurryRef.current = hurry;
    // Measured and scrolled once per line: being held gives the line a new entry, which must not start it again
    const { id } = entry;
    useLayoutEffect(() => {
        const box = boxRef.current;
        const text = textRef.current;
        if (!box || !text) {
            return;
        }
        const over = text.scrollWidth - box.clientWidth;
        if (over <= 1 || motionOff()) {
            return;
        }
        const hurried = hurryRef.current;
        const pause = hurried ? hurriedPause : scrollPause;
        const relaxed = (over / scrollSpeed) * 1000;
        const duration = hurried
            ? Math.min(relaxed, Math.max(hurriedScroll, logMinimum - pause * 2))
            : relaxed;
        onHold(id, pause + duration + pause);
        const animation = text.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${-over}px)` }],
            { duration, delay: pause, easing: 'linear', fill: 'forwards' }
        );
        run.current = { animation, start: performance.now(), pause, duration, hurried };
        return () => {
            animation.cancel();
            run.current = null;
        };
    }, [id, onHold]);

    // A line that comes to keep others waiting part way through speeds up for the rest
    useEffect(() => {
        const current = run.current;
        if (!hurry || !current || current.hurried) {
            return;
        }
        current.hurried = true;
        const elapsed = performance.now() - current.start;
        const left = current.pause + current.duration - elapsed;
        const want = Math.max(hurriedScroll / 2, logMinimum - hurriedPause - elapsed);
        if (left <= 0 || want >= left) {
            return;
        }
        current.animation.updatePlaybackRate(left / want);
        onHold(id, elapsed + want + hurriedPause);
    }, [hurry, id, onHold]);

    return (
        <div ref={boxRef} className='min-w-0 flex-1 overflow-hidden'>
            <div ref={textRef} className='mx-auto w-max whitespace-nowrap'>
                <Messages messages={[entry.message]} compact />
            </div>
        </div>
    );
};

// The phase track, giving way to the game log's newest line while one shows. Tapping a line moves to the next; the
// skip button brings the track back.
const PhaseOrLog = ({ phase, feed, className }) => (
    <div className={classNames('relative', className)}>
        <PhaseRoll
            phase={phase}
            className={classNames('w-full transition-opacity duration-300', {
                'opacity-0': feed.current
            })}
        />
        <AnimatePresence initial={false}>
            {feed.current && (
                <motion.div
                    key={feed.current.id}
                    data-log-line=''
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: fadeTime, ease: 'easeInOut' }}
                    className='absolute inset-0 flex items-center gap-1'
                >
                    <button
                        type='button'
                        title='Next'
                        onClick={feed.skip}
                        className='flex h-full min-w-0 flex-1 items-center text-center text-xs leading-none text-foreground'
                    >
                        <LogText entry={feed.current} hurry={feed.queued > 0} onHold={feed.hold} />
                    </button>
                    <button
                        type='button'
                        data-log-skip=''
                        title='Skip the game log'
                        onClick={feed.dismiss}
                        className='flex h-full shrink-0 items-center gap-0.5 rounded px-1 text-[11px] leading-none text-default-400 hover:text-default-200'
                    >
                        {feed.queued > 0 && <span>{`+${feed.queued}`}</span>}
                        <FontAwesomeIcon icon={faForwardStep} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const inputControls = ['card-name', 'trait-name', 'select-from-values'];
const isInlineControl = (control) => control.type === 'response-delay';

const eachCard = function* (player) {
    for (const pile of Object.values(player?.cardPiles || {})) {
        for (const card of pile || []) {
            yield card;
            yield* card.attachments || [];
            yield* card.dupes || [];
            yield* card.childCards || [];
        }
    }
    for (const card of [
        player?.activePlot,
        player?.faction,
        player?.title,
        ...(player?.agendas || [])
    ]) {
        if (card) {
            yield card;
        }
    }
};

// While we choose cards, how many can be chosen and how many are chosen, across every player's cards
const useSelection = (active) => {
    const players = useSelector((state) => state.lobby.currentGame?.players);
    return useMemo(() => {
        if (!active) {
            return null;
        }
        let selectable = 0;
        let selected = 0;
        for (const player of Object.values(players || {})) {
            for (const card of eachCard(player)) {
                selectable += card.selectable ? 1 : 0;
                selected += card.selected ? 1 : 0;
            }
        }
        return selectable > 0 || selected > 0 ? { selectable, selected } : null;
    }, [active, players]);
};

// An option's style; a way out (cancel) is grey, as on the classic board
export const chipClass = (quiet) =>
    classNames(
        'min-w-0 gap-1 rounded-md border px-2 text-xs font-semibold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background-color,border-color,color,box-shadow] duration-150 data-[pressed=true]:bg-amber-400/20 data-[disabled=true]:opacity-40',
        quiet
            ? 'border-zinc-400/70 bg-zinc-700/80 text-zinc-100 data-[hover=true]:border-zinc-300 data-[hover=true]:bg-zinc-600 data-[hover=true]:text-white'
            : 'border-amber-400/70 bg-black/70 text-amber-100 data-[hover=true]:border-amber-300 data-[hover=true]:bg-amber-400/15 data-[hover=true]:text-white data-[hover=true]:shadow-[0_0_8px_rgba(251,191,36,0.45)]'
    );

const Chip = ({ button, onPress, fullWidth = false }) => {
    const chip = (
        <Button
            type='button'
            size='sm'
            variant='bordered'
            className={classNames(chipClass(button.cancel), fullWidth ? 'h-9 w-full' : 'h-7')}
            onPress={(event) => onPress(event, button)}
            isDisabled={button.disabled}
            disableRipple
        >
            {button.icon && (
                <ThronesIcon
                    icon={button.icon}
                    withBackground
                    noSize={false}
                    className='!flex !h-[1.15rem] !w-[1.15rem] shrink-0 items-center justify-center rounded-full text-[0.75rem] !leading-none'
                />
            )}
            <span className='truncate'>{button.text}</span>
        </Button>
    );
    return button.card ? <CardHoverable code={button.card.code}>{chip}</CardHoverable> : chip;
};

// The buttons as chips on up to maxRows lines (stacked: one full-width chip per line). When they don't fit, none
// show and onOverflow opens them in a panel instead; onFitChange reports whether they fit.
const ChipRows = ({
    buttons,
    chipsKey,
    maxRows = 1,
    stacked = false,
    onPress,
    onFitChange,
    onOverflow,
    children
}) => {
    const ref = useRef(null);
    const [fits, setFits] = useState(true);
    // A new width may fit them all again, so they are put back and measured once more
    const [measure, setMeasure] = useState(0);

    useLayoutEffect(() => {
        setFits(true);
    }, [chipsKey]);

    useLayoutEffect(() => {
        const row = ref.current;
        if (!row) {
            return;
        }
        // Only a change of width can let the chips fit; swapping them for the button changes the height
        let width = row.clientWidth;
        const observer = new ResizeObserver(() => {
            if (row.clientWidth !== width) {
                width = row.clientWidth;
                setFits(true);
                setMeasure((count) => count + 1);
            }
        });
        observer.observe(row);
        return () => observer.disconnect();
    }, []);

    useLayoutEffect(() => {
        const row = ref.current;
        if (!fits || !row || row.children.length === 0) {
            return;
        }
        const rows = new Set(
            [...row.children].map((child) => Math.round(child.getBoundingClientRect().top))
        ).size;
        if (rows > maxRows) {
            setFits(false);
        }
    }, [fits, chipsKey, measure, maxRows]);

    useLayoutEffect(() => {
        onFitChange(fits);
    }, [fits, onFitChange]);

    useEffect(() => {
        if (!fits) {
            onOverflow(chipsKey);
        }
    }, [fits, chipsKey, onOverflow]);

    return (
        <div
            ref={ref}
            data-prompt-chips=''
            className={classNames(
                'flex min-w-0 flex-1 gap-1',
                stacked ? 'max-h-[60dvh] flex-col overflow-y-auto' : 'flex-wrap justify-center'
            )}
        >
            {fits
                ? buttons.map((button, index) => (
                      <Chip key={index} button={button} onPress={onPress} fullWidth={stacked} />
                  ))
                : children}
        </div>
    );
};

// Every option of the prompt, in a panel along the bottom of the screen (the question stays in the bar)
const MorePanel = ({ buttons, onPress, onClose, children }) => (
    <div
        className='fixed inset-x-0 bottom-0 z-[320] flex flex-col rounded-t-lg border-t border-default-200 bg-black/90 pb-[var(--safe-bottom)]'
        style={{ maxHeight: 'calc(100% - var(--board-divider-bottom, 30%))' }}
    >
        <div className='flex justify-end px-1 pt-1'>
            <Button isIconOnly size='sm' variant='light' title='Close' onPress={onClose}>
                <FontAwesomeIcon icon={faXmark} />
            </Button>
        </div>
        <div className='flex flex-col gap-1 overflow-auto p-2'>
            {children}
            {buttons.map((button, index) => (
                <Chip key={index} button={button} onPress={onPress} fullWidth />
            ))}
        </div>
    </div>
);

// A thin line between the phase track and the prompt, fading out at both ends
const Rule = ({ vertical = false }) => (
    <div
        aria-hidden
        className={classNames(
            'shrink-0 via-default-400/50',
            vertical
                ? 'h-6 w-px bg-gradient-to-b from-transparent to-transparent'
                : 'mx-auto mt-1 h-px w-[min(80%,36rem)] bg-gradient-to-r from-transparent to-transparent'
        )}
    />
);

// Seconds the line rests at each end before scrolling, and how fast it scrolls (pixels a second)
const lineRest = 1.6;
const lineSpeed = 18;

// Text kept to one line's height, scrolling up through the rest and back by itself, resting at each end. With
// motion off it scrolls by hand instead.
const OneLine = ({ lines, children }) => {
    const boxRef = useRef(null);
    const innerRef = useRef(null);
    const [over, setOver] = useState(0);
    useLayoutEffect(() => {
        const box = boxRef.current;
        const inner = innerRef.current;
        if (!lines || !box || !inner) {
            return;
        }
        const measure = () => {
            const next = Math.max(0, inner.offsetHeight - box.clientHeight);
            setOver((current) => (Math.abs(current - next) < 1 ? current : next));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(box);
        observer.observe(inner);
        return () => observer.disconnect();
    }, [lines]);
    if (!lines) {
        return <div>{children}</div>;
    }
    // Only the setting, not motionOff()'s moments without motion (a page loading), which would leave it still
    const still = document.documentElement.dataset.motion === 'off';
    const travel = Math.max(1, over / lineSpeed);
    const total = lineRest * 2 + travel * 2;
    return (
        <div
            ref={boxRef}
            data-prompt-line=''
            data-scrolls={over > 1 ? '' : undefined}
            className={classNames(
                still ? 'overflow-y-auto [scrollbar-width:none]' : 'overflow-hidden'
            )}
            style={{ maxHeight: '1.375em' }}
        >
            <motion.div
                ref={innerRef}
                animate={over > 1 && !still ? { y: [0, 0, -over, -over, 0] } : { y: 0 }}
                transition={
                    over > 1 && !still
                        ? {
                              duration: total,
                              times: [
                                  0,
                                  lineRest / total,
                                  (lineRest + travel) / total,
                                  (lineRest * 2 + travel) / total,
                                  1
                              ],
                              ease: 'easeInOut',
                              repeat: Infinity
                          }
                        : { duration: 0 }
                }
            >
                {children}
            </motion.div>
        </div>
    );
};

// The round's phases, giving way to new log lines. inline: at the start of the bar's row rather than on its own line.
// beside: shown on each side of it (the dock's chevrons).
const PhaseTrack = ({ phase, feed, inline = false, inPanel = false, start, end, beside }) => {
    if (inline) {
        return <PhaseOrLog phase={phase} feed={feed} className='w-40 shrink-0' />;
    }
    return (
        <div
            className={classNames('flex items-center gap-2 px-2 pt-1', {
                '[[data-layout=wide]_&]:pr-9': !inPanel
            })}
        >
            <div className='flex min-w-0 flex-1 justify-start'>{start}</div>
            {beside}
            <PhaseOrLog phase={phase} feed={feed} className='w-[min(100%,36rem)] shrink' />
            {beside}
            <div className='flex min-w-0 flex-1 justify-end'>{end}</div>
        </div>
    );
};

// The prompt: the phase track, the prompt's text, and its buttons as chips.
// mode 'panel': beside the board, laid out narrow. mode 'dock': portrait's bottom bar, which keeps a fixed height (one
// line of text, scrolling when longer, and one line of chips) so it never resizes the board; more options spill up
// over the board, and can be drawn back by tapping the bar anywhere but a button.
// allOptions: every option as a chip (phone landscape's column). stackOptions: one full-width option per line (desktop).
const PromptBar = ({
    className,
    mode,
    phase,
    promptTitle,
    promptText: serverPromptText,
    buttons: allButtons,
    controls,
    selecting,
    onButtonClick,
    timer,
    startOfTrack,
    endOfTrack,
    allOptions = false,
    stackOptions = false
}) => {
    const promptButtons = useMemo(() => allButtons || [], [allButtons]);
    const {
        cards,
        pausedPromptId,
        responseDelay,
        promptText,
        endsTurn,
        endTurnReady,
        handleButtonClick,
        handleLookupValueSelected
    } = usePromptActions({
        buttons: promptButtons,
        controls,
        promptText: serverPromptText,
        onButtonClick
    });
    const buttons = useMemo(
        () =>
            endTurnReady
                ? promptButtons
                : promptButtons.map((button) =>
                      button.endsTurn ? { ...button, disabled: true } : button
                  ),
        [promptButtons, endTurnReady]
    );
    const selection = useSelection(selecting);
    const panelControls = (controls || []).filter((control) => !isInlineControl(control));
    const needsInput = panelControls.some((control) => inputControls.includes(control.type));
    const [moreOpen, setMoreOpen] = useState(needsInput);
    const promptKey = `${serverPromptText}|${buttons.map((button) => button.promptId).join(',')}`;

    useEffect(() => {
        setMoreOpen(needsInput);
    }, [promptKey, needsInput]);
    // Options that don't fit open in a panel by themselves, once per prompt, until hidden or chosen from
    const chipsKey = buttons.map((button) => `${button.promptId}:${button.text}`).join('|');
    const [openFor, setOpenFor] = useState(null);
    const [chipsFit, setChipsFit] = useState(true);
    // Only while they do not fit: a turned screen can make room for them in the divider again
    const optionsOpen = openFor !== null && openFor === chipsKey && !chipsFit;
    const autoOpened = useRef(null);

    const onOverflow = useCallback((key) => {
        if (autoOpened.current !== key) {
            autoOpened.current = key;
            setOpenFor(key);
        }
    }, []);
    const barRef = useRef(null);
    // Docked: whether the options past their first line are drawn back. Reset for each new prompt.
    const [retracted, setRetracted] = useState(false);
    useEffect(() => {
        setRetracted(false);
    }, [promptKey]);

    const narrow = mode === 'narrow';
    const short = mode === 'short';
    const inPanel = mode === 'panel';
    const dock = mode === 'dock';
    const stacked = narrow || inPanel || dock;
    const [room, setRoom] = useState(null);
    const chipsClipRef = useRef(null);
    const chipsLayerRef = useRef(null);
    const hintRef = useRef(null);
    // Docked: the room it keeps (the same drawn back or out, so the board never moves), whether the options spill
    // past one line, and the heights of the options and of the hint. The bar is zoomed, so heights set inside it
    // are divided by its zoom.
    const [spill, setSpill] = useState({ over: false, full: null, hint: null });
    // Measured after every render, so only a real change may set state, or it loops
    const roomNow = useRef(null);
    const spillNow = useRef(spill);
    useLayoutEffect(() => {
        const bar = barRef.current;
        const clip = chipsClipRef.current;
        if (!dock || !bar) {
            return;
        }
        const close = (a, b) => a !== null && b !== null && Math.abs(a - b) < 0.5;
        const keepRoom = (next) => {
            if (roomNow.current === null || Math.abs(roomNow.current - next) >= 1) {
                roomNow.current = next;
                setRoom(next);
            }
        };
        const keepSpill = (next) => {
            const current = spillNow.current;
            const same =
                current.over === next.over &&
                (next.full === null
                    ? current.full === null
                    : close(current.full, next.full) && close(current.hint, next.hint));
            if (!same) {
                spillNow.current = next;
                setSpill(next);
            }
        };
        const measure = () => {
            const zoom = parseFloat(getComputedStyle(bar).zoom) || 1;
            const height = bar.getBoundingClientRect().height;
            const layer = chipsLayerRef.current;
            const chips = layer?.querySelector('[data-prompt-chips]');
            const first = chips?.firstElementChild;
            if (!clip || !layer || !chips || !first) {
                keepRoom(Math.round(height));
                if (spillNow.current.over) {
                    keepSpill({ over: false, full: null, hint: null });
                }
                return;
            }
            const over =
                chips.getBoundingClientRect().bottom - first.getBoundingClientRect().bottom > 1;
            const fullPx = layer.getBoundingClientRect().height;
            const hintPx = hintRef.current?.getBoundingClientRect().height ?? 0;
            const around = height - clip.getBoundingClientRect().height;
            const next = Math.round(around + (over ? hintPx : fullPx));
            keepRoom(next);
            keepSpill({ over, full: fullPx / zoom, hint: hintPx / zoom });
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(bar);
        if (chipsLayerRef.current) {
            observer.observe(chipsLayerRef.current);
        }
        return () => observer.disconnect();
    });
    const drawnBack = dock && spill.over && retracted;
    // A tap on the docked prompt, anywhere but something to press, draws its options back or out again
    const toggleSpill = (event) => {
        if (
            !dock ||
            !spill.over ||
            event.target.closest(
                'button, a, input, select, textarea, [role="button"], [role="menuitem"]'
            )
        ) {
            return;
        }
        setRetracted((current) => !current);
    };
    const spillMotion = { duration: motionOff() ? 0 : 0.25, ease: 'easeInOut' };
    const chevrons = dock && spill.over && (
        <FontAwesomeIcon
            icon={faChevronUp}
            aria-hidden
            data-prompt-spill={retracted ? 'back' : 'out'}
            className={classNames(
                'shrink-0 text-[11px] text-default-400 transition-transform duration-300 ease-in-out',
                { 'rotate-180': !retracted }
            )}
        />
    );
    const waiting = buttons.length === 0 && panelControls.length === 0 && !selection;
    const messages = useSelector((state) => state.lobby.currentGame?.messages);
    const feed = useLogFeed(messages);
    const press = (event, button) => {
        setMoreOpen(false);
        setOpenFor(null);
        handleButtonClick(event, button);
    };

    const text = (
        <div
            className={classNames(
                'text-center leading-snug',
                // Docked, a fixed height whatever it says
                dock && 'flex h-8 flex-col justify-center overflow-hidden',
                stacked ? null : 'max-w-[45%] flex-initial',
                stacked ? 'min-w-0' : 'min-w-[11rem]',
                {
                    'text-sm font-semibold': !waiting,
                    'text-xs italic text-default-500': waiting
                }
            )}
        >
            {promptTitle && !waiting && (
                <div
                    className={classNames(
                        'text-[11px] uppercase leading-tight tracking-wider',
                        endsTurn ? 'font-bold text-primary' : 'font-normal text-default-500'
                    )}
                >
                    {promptTitle}
                </div>
            )}
            {/* Docked, the prompt keeps its height whatever it says: longer text scrolls through one line */}
            <OneLine lines={dock}>
                {promptText}
                {selection && selection.selected > 0 && (
                    <span className='ml-2 whitespace-nowrap rounded-full bg-warning px-2 text-tiny font-bold text-black'>
                        {`${selection.selected} selected`}
                    </span>
                )}
            </OneLine>
        </div>
    );
    const corner = <div className='flex shrink-0 items-center gap-1'>{timer}</div>;
    // The button that hides and shows the options panel; in portrait, beside the prompt's text
    const optionsToggle = !chipsFit && buttons.length > 0 && (
        <Button
            type='button'
            size='sm'
            variant='bordered'
            aria-expanded={optionsOpen}
            title={optionsOpen ? 'Hide the options' : `Show the options (${buttons.length})`}
            className='h-6 w-[3.75rem] min-w-0 shrink-0 justify-center gap-1 rounded-full border border-zinc-500/70 bg-zinc-800/90 px-1.5 text-[11px] font-medium text-zinc-200 data-[hover=true]:bg-zinc-700 data-[pressed=true]:bg-zinc-600'
            onPress={() => setOpenFor(optionsOpen ? null : chipsKey)}
            disableRipple
            startContent={
                <FontAwesomeIcon
                    icon={optionsOpen ? faChevronUp : faChevronDown}
                    className='text-[10px]'
                />
            }
        >
            {optionsOpen ? 'Hide' : 'Show'}
        </Button>
    );
    const toggleBesideText = stacked && !!optionsToggle;
    const hasChips = buttons.length > 0 || panelControls.length > 0;
    // Left with nothing to show in portrait, the chips' line takes no room, though it stays to be measured
    // Beside the board (not docked) the prompt has room for a lookup's input, so it is drawn in the prompt itself
    const inlineControls = !dock && panelControls.length > 0;
    const chipsEmpty =
        toggleBesideText && !(panelControls.length > 0 && !moreOpen && !inlineControls);
    const chips = hasChips && (
        <div
            className={classNames('flex min-w-0 flex-1 justify-center gap-1', {
                'mt-1': stacked && !chipsEmpty,
                'max-h-[40dvh] overflow-y-auto': dock,
                'h-0 overflow-hidden': chipsEmpty
            })}
        >
            {buttons.length > 0 && (
                <ChipRows
                    buttons={buttons}
                    chipsKey={chipsKey}
                    maxRows={dock || allOptions || stackOptions ? Infinity : inPanel ? 3 : 1}
                    stacked={stackOptions}
                    onPress={press}
                    onFitChange={setChipsFit}
                    onOverflow={onOverflow}
                >
                    {!toggleBesideText && optionsToggle}
                </ChipRows>
            )}
            {panelControls.length > 0 && !moreOpen && !inlineControls && (
                <Button
                    type='button'
                    size='sm'
                    variant='bordered'
                    className={classNames(chipClass(false), 'h-7 shrink-0')}
                    onPress={() => setMoreOpen(true)}
                >
                    {needsInput ? 'Choose…' : 'Details'}
                </Button>
            )}
        </div>
    );

    const controlsInline = inlineControls && (
        <div data-prompt-controls='' className='flex flex-col'>
            <PromptControls
                controls={panelControls}
                cards={cards}
                pausedPromptId={pausedPromptId}
                onLookupValueSelected={handleLookupValueSelected}
            />
        </div>
    );

    const body = (
        <>
            {!short && (
                <>
                    <PhaseTrack
                        phase={phase}
                        feed={feed}
                        inPanel={inPanel || dock}
                        start={startOfTrack}
                        end={endOfTrack}
                        beside={chevrons}
                    />
                    <Rule />
                </>
            )}
            {stacked ? (
                <div className='flex flex-col px-2 pb-1 pt-1'>
                    {toggleBesideText ? (
                        <div className='flex min-w-0 items-center gap-2'>
                            <div className='flex min-w-0 flex-1 justify-center'>{text}</div>
                            {optionsToggle}
                            {corner}
                        </div>
                    ) : (
                        <div className='grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2'>
                            <span />
                            {text}
                            <div className='justify-self-end'>{corner}</div>
                        </div>
                    )}
                    {dock ? (
                        // Drawn back, the options cross-fade with a hint to tap, as the height slides
                        <motion.div
                            ref={chipsClipRef}
                            data-prompt-clip=''
                            className='relative overflow-hidden'
                            initial={false}
                            animate={{
                                height:
                                    spill.over && spill.full !== null
                                        ? drawnBack
                                            ? spill.hint
                                            : spill.full
                                        : 'auto'
                            }}
                            transition={spillMotion}
                        >
                            <motion.div
                                ref={chipsLayerRef}
                                className={classNames('flow-root', {
                                    'pointer-events-none': drawnBack
                                })}
                                aria-hidden={drawnBack}
                                initial={false}
                                animate={{ opacity: drawnBack ? 0 : 1 }}
                                transition={spillMotion}
                            >
                                {/* With nothing to choose, the line of options is kept, empty */}
                                {chips || <div aria-hidden className='h-8' />}
                            </motion.div>
                            <motion.div
                                ref={hintRef}
                                data-prompt-hint=''
                                aria-hidden={!drawnBack}
                                className='pointer-events-none absolute inset-x-0 top-0 flex h-8 items-center pt-1 justify-center gap-1.5 text-xs text-amber-200/90'
                                initial={false}
                                animate={{ opacity: drawnBack ? 1 : 0 }}
                                transition={spillMotion}
                            >
                                <FontAwesomeIcon icon={faHandPointer} className='animate-pulse' />
                                {`Tap to see the ${buttons.length} options`}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <>
                            {controlsInline}
                            {chips}
                        </>
                    )}
                </div>
            ) : (
                <div
                    className={classNames(
                        'flex min-w-0 items-center gap-3 px-2',
                        mode === 'wide' && 'mx-auto max-w-5xl justify-center',
                        short ? 'py-1' : 'pb-1 pt-1'
                    )}
                >
                    {short && <div className='shrink-0'>{startOfTrack}</div>}
                    {short && <PhaseTrack phase={phase} feed={feed} inline />}
                    {short && <Rule vertical />}
                    {text}
                    {controlsInline}
                    {chips}
                    {corner}
                    {short && <div className='shrink-0'>{endOfTrack}</div>}
                </div>
            )}
        </>
    );
    const bar = (
        <div
            ref={barRef}
            data-prompt-bar=''
            className={classNames(
                'hud-zoom relative w-full border-y border-default-200/60',
                dock && spill.over ? null : 'bg-black/60',
                // Docked at the bottom of the screen, it fills the gesture area below it
                {
                    'pb-[var(--safe-bottom)]': dock,
                    // Spilling over the board, it hides what it lies over
                    'cursor-pointer bg-zinc-950/95': dock && spill.over
                },
                className
            )}
            onClick={toggleSpill}
        >
            {body}
            <AnimatePresence initial={false}>
                {optionsOpen && (
                    <motion.div
                        key='options'
                        data-prompt-options=''
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: motionOff() ? 0 : 0.2, ease: 'easeOut' }}
                        className='absolute inset-x-0 top-full z-[260] overflow-hidden border-b border-amber-400/40 bg-black/60 backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.7)]'
                    >
                        <div className='flex max-h-[calc(100dvh-var(--board-prompt-bottom,50dvh)-1rem)] flex-wrap content-start justify-center gap-1.5 overflow-y-auto p-2'>
                            {buttons.map((button, index) => (
                                <Chip key={index} button={button} onPress={press} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {responseDelay && (
                <div className='absolute inset-x-0 bottom-0'>
                    <PromptControls
                        controls={controls}
                        only={isInlineControl}
                        cards={cards}
                        pausedPromptId={pausedPromptId}
                        onLookupValueSelected={handleLookupValueSelected}
                        slimDelay
                    />
                </div>
            )}
            {moreOpen && dock && (
                <MorePanel buttons={buttons} onPress={press} onClose={() => setMoreOpen(false)}>
                    <PromptControls
                        controls={panelControls}
                        cards={cards}
                        pausedPromptId={pausedPromptId}
                        onLookupValueSelected={(...args) => {
                            setMoreOpen(false);
                            handleLookupValueSelected(...args);
                        }}
                    />
                </MorePanel>
            )}
        </div>
    );
    if (!dock) {
        return bar;
    }
    return (
        <div
            data-prompt-dock=''
            className={classNames('relative shrink-0', moreOpen ? 'z-[320]' : 'z-[260]')}
            style={room === null ? undefined : { height: room }}
        >
            <div className={room === null ? 'relative' : 'absolute inset-x-0 bottom-0'}>{bar}</div>
        </div>
    );
};

export default PromptBar;
