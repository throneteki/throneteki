import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Button from '../../Site/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronUp,
    faForwardStep,
    faHandPointer,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import ThronesIcon from '../ThronesIcon';
import CardHoverable from '../../Images/CardHoverable';
import { PromptControls, usePromptActions } from '../usePromptActions';
import { getButtonShortcutLabel } from '../keyboardShortcuts';
import PhaseRoll from './PhaseRoll';
import { chipClass } from './chipClass';
import PendingSpinner from './PendingSpinner';
import WaitingChip, { WaitingRow } from '../WaitingChip';
import { useWaitingForServer } from '../serverWait';
import { motionOff, motionSettingOff } from '../../../flip';
import Messages from '../Messages';
import { logTiming, useLogFeed } from './useLogFeed';

// A log line, on one line: when it does not fit, it scrolls along once to its end, and asks to be shown for as long
// as that takes. While other lines wait (hurry) it scrolls at a faster, steady speed, whatever its length.
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
        // Set on the element, not in state, so the line is not drawn again as it fades (.log-fade in index.css)
        const fade = (edge, on) => box.toggleAttribute(`data-fade-${edge}`, on);
        fade('start', false);
        fade('end', over > 1);
        if (over <= 1 || motionOff()) {
            return;
        }
        const hurried = hurryRef.current;
        const pause = hurried ? logTiming.queuedScrollPause : logTiming.scrollPause;
        const speed = hurried ? logTiming.queuedScrollSpeed : logTiming.scrollSpeed;
        const duration = (over / speed) * 1000;
        onHold(id, pause + duration + pause);
        const animation = text.animate(
            [{ transform: 'translateX(0)' }, { transform: `translateX(${-over}px)` }],
            { duration, delay: pause, easing: 'linear', fill: 'forwards' }
        );
        run.current = { animation, start: performance.now(), pause, duration, hurried };
        // The start fades in once the text moves off it, and the end fades out once the text reaches it
        let frame = requestAnimationFrame(function moving() {
            if (animation.currentTime >= pause) {
                fade('start', true);
            } else {
                frame = requestAnimationFrame(moving);
            }
        });
        animation.finished.then(() => fade('end', false)).catch(() => {});
        return () => {
            cancelAnimationFrame(frame);
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
        if (left <= 0) {
            return;
        }
        const rate = logTiming.queuedScrollSpeed / logTiming.scrollSpeed;
        current.animation.updatePlaybackRate(rate);
        onHold(id, elapsed + left / rate + logTiming.queuedScrollPause);
    }, [hurry, id, onHold]);

    return (
        <div ref={boxRef} className='log-fade min-w-0 flex-1 overflow-hidden'>
            <div ref={textRef} className='mx-auto w-max whitespace-nowrap'>
                <Messages messages={[entry.message]} compact />
            </div>
        </div>
    );
};

// The skip button is only as wide as its icon; the count of lines waiting is a small badge on the icon's corner
const skipClass = 'flex h-full items-center px-1.5 text-[11px] leading-none';

// The phase track, giving way to the game log's newest line while one shows. Tapping a line or the skip button moves
// to the next, and the track comes back once none are left.
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
                    transition={{ duration: logTiming.fade / 1000, ease: 'easeInOut' }}
                    // The skip button sits at the right, and an unseen copy of it at the left, so the line has the
                    // same room each side and stays centred while taking the rest of the width
                    className='absolute inset-0 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center'
                >
                    <span aria-hidden className={classNames(skipClass, 'invisible')}>
                        <FontAwesomeIcon icon={faForwardStep} />
                    </span>
                    <button
                        type='button'
                        title='Next'
                        onClick={feed.skip}
                        className='flex h-full min-w-0 items-center text-center text-xs leading-none text-foreground'
                    >
                        <LogText entry={feed.current} hurry={feed.queued > 0} onHold={feed.hold} />
                    </button>
                    <button
                        type='button'
                        data-log-skip=''
                        title='Skip this line'
                        onClick={feed.skip}
                        className={classNames(
                            skipClass,
                            'rounded text-ink-faint hover:text-ink-faint'
                        )}
                    >
                        <span className='relative'>
                            <FontAwesomeIcon icon={faForwardStep} />
                            {feed.queued > 0 && (
                                <span
                                    data-log-queued=''
                                    className='absolute -right-2 -top-2 flex h-3 min-w-3 items-center justify-center rounded-full bg-white/25 px-0.5 text-[8px] font-bold leading-none text-foreground'
                                >
                                    {feed.queued > 99 ? '99+' : feed.queued}
                                </span>
                            )}
                        </span>
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

const Chip = ({ button, onPress, fullWidth = false, shortcut }) => {
    const chip = (
        <Button
            type='button'
            size='sm'
            variant='outline'
            className={classNames(
                chipClass(button.cancel),
                'relative',
                fullWidth ? 'h-9 w-full' : 'h-7',
                // Room for the shortcut and spinner, keeping the label centred
                (shortcut || (button.pending && fullWidth)) && 'px-6'
            )}
            onPress={(event) => onPress(event, button)}
            isDisabled={button.disabled}
        >
            {button.icon && (
                <ThronesIcon
                    icon={button.icon}
                    withBackground
                    noSize={false}
                    className='!flex !h-[1.15rem] !w-[1.15rem] shrink-0 items-center justify-center rounded-full text-[0.75rem] !leading-none'
                />
            )}
            {/* At the left as classic's are, apart from the label so it stays put however the label shortens */}
            {shortcut && (
                <kbd className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 font-sans text-[10px] font-normal opacity-60'>
                    {shortcut}
                </kbd>
            )}
            <span className='truncate'>{button.text}</span>
            {/* A chip as wide as its label (on phones) has no room beside it */}
            <PendingSpinner pending={button.pending} corner={!fullWidth} />
        </Button>
    );
    return button.card ? <CardHoverable code={button.card.code}>{chip}</CardHoverable> : chip;
};

// The buttons as chips; stacked: one full-width chip per line. shortcuts: each says the key that presses it, as
// classic's prompt does, whether or not it can be pressed just now, so the numbers never shift. fill: they take the
// line's room, rather than sitting beside something that does
const ChipRows = ({ buttons, stacked = false, shortcuts = false, fill = true, onPress }) => (
    <div
        data-prompt-chips=''
        className={classNames(
            'flex min-w-0 gap-1',
            fill ? 'flex-1' : 'shrink-0',
            stacked ? 'max-h-[60dvh] flex-col overflow-y-auto' : 'flex-wrap justify-center'
        )}
    >
        {buttons.map((button, index) => (
            <Chip
                key={index}
                button={button}
                onPress={onPress}
                fullWidth={stacked}
                shortcut={shortcuts && getButtonShortcutLabel(buttons, index)}
            />
        ))}
    </div>
);

// Every option of the prompt, in a panel along the bottom of the screen. It covers the bar, so the question
// (heading) is asked again at its top.
const MorePanel = ({ heading, buttons, onPress, onClose, children }) => (
    <div
        className='fixed inset-x-0 bottom-0 z-[320] flex flex-col rounded-t-lg border-t border-white/15 bg-black/90 pb-[var(--safe-bottom)]'
        style={{ maxHeight: 'calc(100% - var(--board-divider-bottom, 30%))' }}
    >
        <div className='grid grid-cols-[2rem_1fr_2rem] items-center gap-1 px-1 pt-1'>
            <span />
            <div className='min-w-0 text-center leading-snug'>{heading}</div>
            <Button isIconOnly size='sm' variant='ghost' title='Close' onPress={onClose}>
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
const Rule = () => (
    <div
        aria-hidden
        className='mx-auto mt-1 h-px w-[min(80%,36rem)] shrink-0 bg-gradient-to-r from-transparent via-white/[0.175] to-transparent'
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
    const still = motionSettingOff();
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

const titleFade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25 }
};

// The round's phases, giving way to new log lines; beside: shown on each side of it (the dock's chevrons)
const PhaseTrack = ({ phase, feed, beside }) => (
    <div className='flex items-center justify-center gap-2 px-2 pt-1'>
        {beside}
        <PhaseOrLog phase={phase} feed={feed} className='w-[min(100%,36rem)] min-w-0 shrink' />
        {beside}
    </div>
);

// The prompt: the phase track, its text and its buttons as chips. mode 'panel': beside the board. mode 'dock':
// portrait's bottom bar, a fixed height (one line of text, one of chips) so it never resizes the board; more options
// spill up over it and a tap on the bar draws them back. stackOptions: one full-width option per line.
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
    stackOptions = false,
    showLog = true,
    shortcuts = false
}) => {
    const promptButtons = useMemo(() => allButtons || [], [allButtons]);
    const {
        cards,
        pausedPromptId,
        responseDelay,
        promptText,
        endsTurn,
        endTurnReady,
        shortcutsEnabled,
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
    // Docked, a lookup (a value or a name to choose) is asked for in the bar, on the options' line; anything else the
    // prompt shows (its targets) opens over the bar from Details
    const dock = mode === 'dock';
    const inputsInBar = dock && needsInput;
    const detailControls = inputsInBar
        ? panelControls.filter((control) => !inputControls.includes(control.type))
        : panelControls;
    const [moreOpen, setMoreOpen] = useState(false);
    const promptKey = `${serverPromptText}|${buttons.map((button) => button.promptId).join(',')}`;

    useEffect(() => {
        setMoreOpen(false);
    }, [promptKey]);
    const barRef = useRef(null);
    // Docked: whether the options past their first line are drawn back. Reset for each new prompt.
    const [retracted, setRetracted] = useState(false);
    useEffect(() => {
        setRetracted(false);
    }, [promptKey]);

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
    const measureRef = useRef(null);
    measureRef.current = () => {
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
    };
    useLayoutEffect(() => measureRef.current());
    useLayoutEffect(() => {
        if (!dock || !barRef.current) {
            return;
        }
        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(barRef.current);
        if (chipsLayerRef.current) {
            observer.observe(chipsLayerRef.current);
        }
        return () => observer.disconnect();
    }, [dock]);
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
                'shrink-0 text-[11px] text-ink-faint transition-transform duration-300 ease-in-out',
                { 'rotate-180': !retracted }
            )}
        />
    );
    const waiting = buttons.length === 0 && panelControls.length === 0 && !selection;
    const messages = useSelector((state) => state.lobby.currentGame?.messages);
    const feed = useLogFeed(messages, { enabled: showLog });
    const press = (event, button) => {
        setMoreOpen(false);
        handleButtonClick(event, button);
    };

    const waitingForServer = useWaitingForServer();
    const title = promptTitle && !waiting && (
        <div
            className={classNames(
                'text-[11px] uppercase leading-tight tracking-wider',
                endsTurn ? 'font-bold text-accent' : 'font-normal text-ink-dim'
            )}
        >
            {promptTitle}
        </div>
    );
    const text = (
        <div
            className={classNames(
                'min-w-0 text-center leading-snug',
                dock && 'flex h-8 flex-col justify-center overflow-hidden',
                {
                    'text-sm font-semibold': !waiting,
                    'text-xs italic text-ink-dim': waiting
                }
            )}
        >
            {dock ? (
                // The docked bar keeps its height, so a long wait takes the title's line for a while
                <AnimatePresence mode='wait' initial={false}>
                    {waitingForServer ? (
                        <motion.div key='waiting' {...titleFade}>
                            <WaitingChip />
                        </motion.div>
                    ) : (
                        title && (
                            <motion.div key='title' {...titleFade}>
                                {title}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            ) : (
                title
            )}
            {/* Docked, the prompt keeps its height whatever it says: longer text scrolls through one line */}
            <OneLine lines={dock}>
                {promptText}
                {selection && selection.selected > 0 && (
                    <span className='ml-2 whitespace-nowrap rounded-full bg-warning px-2 text-xs font-bold text-black'>
                        {`${selection.selected} selected`}
                    </span>
                )}
            </OneLine>
        </div>
    );
    const corner = <div className='flex shrink-0 items-center gap-1'>{timer}</div>;
    const hasChips = buttons.length > 0 || panelControls.length > 0;
    // Beside the board (not docked) there is room for a lookup's input in the prompt itself
    const inlineControls = !dock && panelControls.length > 0;
    const chips = hasChips && (
        <div
            className={classNames('mt-1 flex min-w-0 flex-1 justify-center gap-1', {
                'max-h-[40dvh] overflow-y-auto': dock && !inputsInBar,
                'flex-col': inputsInBar && stackOptions
            })}
        >
            {inputsInBar && (
                <div data-prompt-controls='' className='flex min-w-0'>
                    <PromptControls
                        controls={panelControls}
                        only={(control) => inputControls.includes(control.type)}
                        cards={cards}
                        pausedPromptId={pausedPromptId}
                        onLookupValueSelected={handleLookupValueSelected}
                        compact
                    />
                </div>
            )}
            {buttons.length > 0 && (
                <ChipRows
                    buttons={buttons}
                    stacked={stackOptions}
                    shortcuts={shortcuts && shortcutsEnabled}
                    fill={!inputsInBar || stackOptions}
                    onPress={press}
                />
            )}
            {detailControls.length > 0 && !moreOpen && !inlineControls && (
                <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    className={classNames(chipClass(false), 'h-7 shrink-0')}
                    onPress={() => setMoreOpen(true)}
                >
                    Details
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
            <PhaseTrack phase={phase} feed={feed} beside={chevrons} />
            <Rule />
            <div className='flex flex-col px-2 pb-1 pt-1'>
                {!dock && <WaitingRow waiting={waitingForServer} />}
                <div className='grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2'>
                    <span />
                    {text}
                    <div className='justify-self-end'>{corner}</div>
                </div>
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
                            {chips || <div aria-hidden className='h-8' />}
                        </motion.div>
                        <motion.div
                            ref={hintRef}
                            data-prompt-hint=''
                            aria-hidden={!drawnBack}
                            className='pointer-events-none absolute inset-x-0 top-0 flex h-8 items-center justify-center gap-1.5 pt-1 text-xs text-amber-200/90'
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
        </>
    );
    const bar = (
        <div
            ref={barRef}
            data-prompt-bar=''
            className={classNames(
                'hud-zoom relative w-full border-y border-white/[0.090]',
                dock && spill.over ? 'cursor-pointer bg-zinc-950/95' : 'bg-black/60',
                { 'pb-[var(--safe-bottom)]': dock },
                className
            )}
            onClick={toggleSpill}
        >
            {body}
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
                <MorePanel
                    heading={
                        <>
                            {title}
                            <div className='text-sm font-semibold'>{promptText}</div>
                        </>
                    }
                    buttons={buttons}
                    onPress={press}
                    onClose={() => setMoreOpen(false)}
                >
                    <PromptControls
                        controls={detailControls}
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
            className={classNames(
                'relative shrink-0',
                // Spilled out, its options rise over our tools (z-306), so none is hidden under them
                moreOpen || (spill.over && !drawnBack) ? 'z-[320]' : 'z-[260]'
            )}
            style={room === null ? undefined : { height: room }}
        >
            <div className={room === null ? 'relative' : 'absolute inset-x-0 bottom-0'}>{bar}</div>
        </div>
    );
};

export default PromptBar;
