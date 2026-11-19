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

// The phase track, or the game log's newest line in its place: the track fades out while a line shows and comes
// back after. Tapping the line goes on to the next one; the skip button beside it, showing how many more wait,
// puts the track back straight away.
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
                        className='flex h-full min-w-0 flex-1 items-center text-center text-[11px] leading-none text-foreground'
                    >
                        <LogText entry={feed.current} hurry={feed.queued > 0} onHold={feed.hold} />
                    </button>
                    <button
                        type='button'
                        data-log-skip=''
                        title='Skip the game log'
                        onClick={feed.dismiss}
                        className='flex h-full shrink-0 items-center gap-0.5 rounded px-1 text-[9px] leading-none text-default-400 hover:text-default-200'
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

// The divider's buttons: dark, with a thin gold edge and cream small capitals; a way out (cancel, pass) is grey,
// as on the classic board. With a pointer over it, it lights up.
const chipClass = (quiet) =>
    classNames(
        'min-w-0 gap-1 rounded-md border px-2 text-[11px] font-semibold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[background-color,border-color,color,box-shadow] duration-150 data-[pressed=true]:bg-amber-400/20 data-[disabled=true]:opacity-40',
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

// The buttons as chips, on up to maxRows lines, when they all fit (stacked: each on a line of its own, the full width). When they do not, none show here (only children,
// if any): the options open in a panel over our board instead (onOverflow, once for each prompt), and a button hides
// and shows them again. Whether they fit is told to onFitChange, so that button can go beside the prompt's text.
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

// Every button and control of the prompt, in a panel along the bottom of the screen. It stays below the divider,
// which shows the question, so the question is not repeated here.
const MorePanel = ({ buttons, onPress, onClose, children }) => (
    <div
        className='fixed inset-x-0 bottom-0 z-[320] flex flex-col rounded-t-lg border-t border-default-200 bg-black/90 pb-[var(--safe-bottom)] hud-zoom'
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

// The round's phases along the top edge of the divider, rolling along as the game moves on, giving way to the
// game log's new lines. Inline, it sits at the
// start of the divider's one row instead of taking a line of its own.
const PhaseTrack = ({ phase, feed, inline = false, inPanel = false, start, end }) => {
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
            <PhaseOrLog phase={phase} feed={feed} className='w-[min(100%,36rem)] shrink' />
            <div className='flex min-w-0 flex-1 justify-end'>{end}</div>
        </div>
    );
};

// The prompt: the phase track along its top, what to do and the buttons as chips beneath, and anything more in a
// panel. While waiting on someone else it is one line. Narrow, the text and the chips each take a line; wider, they
// share one. As a panel at the side of the board (mode 'panel'), it is laid out as narrow, its chips wrapping onto a
// few lines before they give way to the options panel. Docked below our hand in portrait (mode 'dock'), it shows
// every option, keeping the room of one line of them and reaching up over the board for the rest, and folds away
// from the tab on its top edge. allOptions: every option shows as a chip, however many lines they take (phone
// landscape's column, which scrolls the prompt when it outgrows it). stackOptions: every option on a line of its own,
// the full width (the desktop's panel, as on the classic board).
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
    const buttons = useMemo(() => allButtons || [], [allButtons]);
    const {
        cards,
        pausedPromptId,
        responseDelay,
        promptText,
        handleButtonClick,
        handleLookupValueSelected
    } = usePromptActions({ buttons, controls, promptText: serverPromptText, onButtonClick });
    const selection = useSelection(selecting);
    const panelControls = (controls || []).filter((control) => !isInlineControl(control));
    const needsInput = panelControls.some((control) => inputControls.includes(control.type));
    const [moreOpen, setMoreOpen] = useState(needsInput);
    const promptKey = `${serverPromptText}|${buttons.map((button) => button.promptId).join(',')}`;

    useEffect(() => {
        setMoreOpen(needsInput);
    }, [promptKey, needsInput]);
    // Options too many for the divider open in a panel over our board, by themselves for each new prompt, and stay
    // until hidden or chosen from. Open for one prompt is closed for the next.
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
    const [folded, setFoldedState] = useState(false);
    const foldedRef = useRef(folded);
    foldedRef.current = folded;
    // Folding and unfolding animate its height, during which what it would keep below the hand is left as it was.
    // Marked here rather than when the animation starts, which is after the room is measured for the new state.
    const folding = useRef(false);
    const setFolded = useCallback((next) => {
        if (next !== foldedRef.current) {
            folding.current = true;
            setFoldedState(next);
        }
    }, []);
    // A new prompt to answer unfolds it
    const asks = buttons.length > 0 || panelControls.length > 0;
    useEffect(() => {
        if (asks) {
            setFolded(false);
        }
    }, [promptKey, asks, setFolded]);

    const narrow = mode === 'narrow';
    const short = mode === 'short';
    const inPanel = mode === 'panel';
    const dock = mode === 'dock';
    const stacked = narrow || inPanel || dock;
    const [room, setRoom] = useState(null);
    const keeps = useRef(null);
    const [settled, setSettled] = useState(0);
    // Docked, it keeps the room it needs with one line of options, and the lines past that lie over the board
    useLayoutEffect(() => {
        const bar = barRef.current;
        if (!dock || !bar) {
            return;
        }
        const measure = () => {
            const height = bar.getBoundingClientRect().height;
            const body = bar.querySelector('[data-prompt-body]');
            if (body && !folded && !folding.current) {
                const chips = body.querySelector('[data-prompt-chips]');
                const first = chips?.firstElementChild;
                const extra =
                    chips && first
                        ? Math.max(
                              0,
                              chips.getBoundingClientRect().height -
                                  first.getBoundingClientRect().height
                          )
                        : 0;
                keeps.current = height - extra;
            }
            const next = Math.round(Math.min(height, keeps.current ?? height));
            setRoom((current) => (current === next ? current : next));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(bar);
        return () => observer.disconnect();
    }, [dock, settled, folded]);
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
                stacked ? null : 'max-w-[45%] flex-initial',
                stacked ? 'min-w-0' : 'min-w-[11rem]',
                {
                    'text-sm font-semibold': !waiting,
                    'text-xs italic text-default-500': waiting
                }
            )}
        >
            {promptTitle && !waiting && (
                <div className='text-[10px] font-normal uppercase leading-tight tracking-wider text-default-500'>
                    {promptTitle}
                </div>
            )}
            <div>
                {promptText}
                {selection && selection.selected > 0 && (
                    <span className='ml-2 whitespace-nowrap rounded-full bg-warning px-2 text-tiny font-bold text-black'>
                        {`${selection.selected} selected`}
                    </span>
                )}
            </div>
        </div>
    );
    const corner = <div className='flex shrink-0 items-center gap-1'>{timer}</div>;
    // The button that hides and shows options too many for the divider. In portrait it goes beside the prompt's
    // text rather than taking a line of its own.
    const optionsToggle = !chipsFit && buttons.length > 0 && (
        <Button
            type='button'
            size='sm'
            variant='bordered'
            aria-expanded={optionsOpen}
            title={optionsOpen ? 'Hide the options' : `Show the options (${buttons.length})`}
            className='h-5 w-[3.25rem] min-w-0 shrink-0 justify-center gap-1 rounded-full border border-zinc-500/70 bg-zinc-800/90 px-1.5 text-[10px] font-medium text-zinc-200 data-[hover=true]:bg-zinc-700 data-[pressed=true]:bg-zinc-600'
            onPress={() => setOpenFor(optionsOpen ? null : chipsKey)}
            disableRipple
            startContent={
                <FontAwesomeIcon
                    icon={optionsOpen ? faChevronUp : faChevronDown}
                    className='text-[8px]'
                />
            }
        >
            {optionsOpen ? 'Hide' : 'Show'}
        </Button>
    );
    const toggleBesideText = stacked && !!optionsToggle;
    const hasChips = buttons.length > 0 || panelControls.length > 0;
    // Left with nothing to show in portrait, the chips' line takes no room, though it stays to be measured
    const chipsEmpty = toggleBesideText && !(panelControls.length > 0 && !moreOpen);
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
            {panelControls.length > 0 && !moreOpen && (
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

    const foldTab = dock && (
        <button
            type='button'
            data-prompt-fold=''
            aria-expanded={!folded}
            title={folded ? 'Show the prompt' : 'Hide the prompt'}
            onClick={() => setFolded(!folded)}
            className='absolute left-1/2 top-0 z-10 flex h-4 w-12 -translate-x-1/2 -translate-y-full items-center justify-center rounded-t-md border border-b-0 border-default-200/60 bg-black/60 text-[9px] text-default-300 hover:text-white'
        >
            <FontAwesomeIcon icon={folded ? faChevronUp : faChevronDown} />
        </button>
    );
    // The whole prompt and its folded line both stay, one shrinking away as the other grows
    const foldMotion = (shown) => ({
        initial: false,
        animate: shown ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 },
        transition: { duration: motionOff() ? 0 : 0.25, ease: 'easeInOut' },
        onAnimationStart: () => {
            folding.current = true;
        },
        onAnimationComplete: () => {
            folding.current = false;
            setSettled((count) => count + 1);
        }
    });
    const foldedLine = (
        <div className='flex min-w-0 items-center gap-2 px-2 py-0.5 text-xs'>
            <span
                className={classNames('min-w-0 flex-1 truncate text-center', {
                    'italic text-default-500': waiting
                })}
            >
                {promptText}
            </span>
            {corner}
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
                    {chips}
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
                'hud-zoom relative w-full border-y border-default-200/60 bg-black/60',
                // Docked at the bottom of the screen, it fills the gesture area below it
                { 'pb-[var(--safe-bottom)]': dock },
                className
            )}
        >
            {foldTab}
            {dock ? (
                <>
                    <motion.div
                        data-prompt-body=''
                        aria-hidden={folded}
                        className='overflow-hidden'
                        {...foldMotion(!folded)}
                    >
                        {body}
                    </motion.div>
                    <motion.div
                        aria-hidden={!folded}
                        className='overflow-hidden'
                        {...foldMotion(folded)}
                    >
                        {foldedLine}
                    </motion.div>
                </>
            ) : (
                body
            )}
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
            {moreOpen && (
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
            className='relative z-[260] shrink-0'
            style={room === null ? undefined : { height: room }}
        >
            <div className={room === null ? 'relative' : 'absolute inset-x-0 bottom-0'}>{bar}</div>
        </div>
    );
};

export default PromptBar;
