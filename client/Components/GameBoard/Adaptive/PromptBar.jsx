import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ThronesIcon from '../ThronesIcon';
import CardHoverable from '../../Images/CardHoverable';
import { PromptControls, usePromptActions } from '../usePromptActions';

const inputControls = ['card-name', 'trait-name', 'select-from-values'];
const isInlineControl = (control) => control.type === 'response-delay';

const phases = [
    { name: 'plot', label: 'Plot' },
    { name: 'draw', label: 'Draw' },
    { name: 'marshal', label: 'Marshaling' },
    { name: 'challenge', label: 'Challenges' },
    { name: 'dominance', label: 'Dominance' },
    { name: 'standing', label: 'Standing' },
    { name: 'taxation', label: 'Taxation' }
];

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

const Chip = ({ button, onPress, fullWidth = false }) => {
    const chip = (
        <Button
            type='button'
            size='sm'
            color={button.cancel ? 'default' : 'primary'}
            className={classNames('h-7 min-w-0 px-2.5 text-xs', { 'w-full': fullWidth })}
            onPress={(event) => onPress(event, button)}
            isDisabled={button.disabled}
            disableRipple
        >
            {button.icon && <ThronesIcon icon={button.icon} withBackground noSize={false} />}
            <span className='truncate'>{button.text}</span>
        </Button>
    );
    return button.card ? <CardHoverable code={button.card.code}>{chip}</CardHoverable> : chip;
};

// The buttons as chips filling up to a number of rows; those that do not fit go under "More"
const ChipRows = ({ buttons, maxRows, align = 'start', onPress, onMore }) => {
    const ref = useRef(null);
    const [shown, setShown] = useState(buttons.length);
    // A new width can fit more chips or fewer, so it starts again from all of them and measures once more
    const [measure, setMeasure] = useState(0);
    const key = buttons.map((button) => `${button.promptId}:${button.text}`).join('|');

    useLayoutEffect(() => {
        setShown(buttons.length);
    }, [key, buttons.length]);

    useLayoutEffect(() => {
        const row = ref.current;
        if (!row) {
            return;
        }
        // Only a change of width can let more chips fit; hiding chips changes the height
        let width = row.clientWidth;
        const observer = new ResizeObserver(() => {
            if (row.clientWidth !== width) {
                width = row.clientWidth;
                setShown(buttons.length);
                setMeasure((count) => count + 1);
            }
        });
        observer.observe(row);
        return () => observer.disconnect();
    }, [buttons.length]);

    // Each pass hides one more button behind "More" until the chips fit the rows
    useLayoutEffect(() => {
        const row = ref.current;
        if (!row || row.children.length === 0) {
            return;
        }
        const rows = new Set(
            [...row.children].map((child) => Math.round(child.getBoundingClientRect().top))
        ).size;
        if (rows > maxRows && shown > (maxRows > 1 ? 1 : 0)) {
            setShown(shown - 1);
        }
    }, [shown, maxRows, key, measure]);

    const hidden = buttons.length - shown;
    return (
        <div
            ref={ref}
            className={classNames('flex min-w-0 flex-wrap gap-1', {
                'justify-end': align === 'end'
            })}
        >
            {buttons.slice(0, shown).map((button, index) => (
                <Chip key={index} button={button} onPress={onPress} />
            ))}
            {hidden > 0 && (
                <Button
                    type='button'
                    size='sm'
                    variant='bordered'
                    className='h-7 min-w-0 px-2.5 text-xs'
                    onPress={onMore}
                >
                    {`More (${hidden})`}
                </Button>
            )}
        </div>
    );
};

// Every button and control of the prompt, in a panel along the bottom of the screen
const MorePanel = ({ promptText, buttons, onPress, onClose, children }) => (
    <div className='fixed inset-x-0 bottom-0 z-[320] flex max-h-[70%] flex-col rounded-t-lg border-t border-default-200 bg-black/90 pb-[env(safe-area-inset-bottom)] hud-zoom'>
        <div className='flex items-center gap-2 border-b border-default-200 px-3 py-2'>
            <span className='flex-1 text-sm font-bold'>{promptText}</span>
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

// The round's phases along the top edge of the divider: those gone by dimmed, the current one lit and named.
// Compact, the others show only their initial. Inline, it sits at the start of the divider's one row, with the
// players' totals stacked beside it, instead of taking a line of its own.
const PhaseTrack = ({ phase, compact, inline = false, start, end }) => {
    const current = phases.findIndex((entry) => entry.name === phase);
    if (inline) {
        return (
            <div className='flex shrink-0 items-center text-[10px] leading-tight'>
                <PhaseNames phase={phase} current={current} compact />
            </div>
        );
    }
    return (
        <div className='flex items-center gap-2 px-2 pt-1 text-[10px] uppercase leading-none tracking-wider [[data-layout=wide]_&]:pr-9'>
            <div className='flex min-w-0 flex-1 justify-start'>{start}</div>
            <PhaseNames phase={phase} current={current} compact={compact} />
            <div className='flex min-w-0 flex-1 justify-end'>{end}</div>
        </div>
    );
};

const PhaseNames = ({ phase, current, compact }) => (
    <div className='flex shrink-0 items-center gap-1.5 uppercase tracking-wider'>
        {phase === 'setup' && <span className='font-bold text-warning'>Setup</span>}
        {phases.map((entry, index) => {
            const isCurrent = index === current;
            return (
                <span
                    key={entry.name}
                    title={entry.label}
                    className={classNames({
                        'font-bold text-warning': isCurrent,
                        'text-default-400/50': current >= 0 && index < current,
                        'text-default-400': current < 0 || index > current
                    })}
                >
                    {isCurrent ? `◆ ${entry.label}` : compact ? entry.label[0] : entry.label}
                </span>
            );
        })}
    </div>
);

// The prompt, as the divider between the two halves of the board: the phase track along its top, what to do and
// the buttons as chips beneath, and anything more in a panel. While waiting on someone else it is one line.
// Narrow, the text and the chips each take a line; wider, they share one.
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
    actions,
    startOfTrack,
    endOfTrack
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

    const narrow = mode === 'narrow';
    const short = mode === 'short';
    const waiting = buttons.length === 0 && panelControls.length === 0 && !selection;
    const press = (event, button) => {
        setMoreOpen(false);
        handleButtonClick(event, button);
    };

    const text = (
        <div
            className={classNames('flex-1 leading-snug', narrow ? 'min-w-0' : 'min-w-[11rem]', {
                'text-sm font-semibold': !waiting,
                'text-xs italic text-default-500': waiting
            })}
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
    const corner = (
        <div className='flex shrink-0 items-center gap-1'>
            {timer}
            {actions}
        </div>
    );
    const hasChips = buttons.length > 0 || panelControls.length > 0;
    const chips = hasChips && (
        <div className={classNames('flex min-w-0 gap-1', { 'max-w-[65%] shrink': !narrow })}>
            {buttons.length > 0 && (
                <ChipRows
                    buttons={buttons}
                    maxRows={short ? 1 : 2}
                    align={narrow ? 'start' : 'end'}
                    onPress={press}
                    onMore={() => setMoreOpen(true)}
                />
            )}
            {panelControls.length > 0 && !moreOpen && (
                <Button
                    type='button'
                    size='sm'
                    variant='bordered'
                    className='h-7 shrink-0 text-xs'
                    onPress={() => setMoreOpen(true)}
                >
                    {needsInput ? 'Choose…' : 'Details'}
                </Button>
            )}
        </div>
    );

    return (
        <div
            data-prompt-bar=''
            className={classNames(
                'hud-zoom relative w-full border-y bg-gradient-to-b from-black/90 via-black/75 to-black/90',
                selection
                    ? 'border-warning shadow-[0_0_14px_rgba(245,165,36,0.35)]'
                    : 'border-default-200/60',
                className
            )}
        >
            {!short && (
                <PhaseTrack phase={phase} compact={narrow} start={startOfTrack} end={endOfTrack} />
            )}
            {narrow ? (
                <div className='flex flex-col gap-1 px-2 pb-1 pt-0.5'>
                    <div className='flex min-w-0 items-center gap-2'>
                        {text}
                        {corner}
                    </div>
                    {chips}
                </div>
            ) : (
                <div
                    className={classNames(
                        'flex min-w-0 items-center gap-3 px-2 [[data-layout=wide]_&]:pr-9',
                        short ? 'py-1' : 'pb-1 pt-0.5'
                    )}
                >
                    {short && <div className='shrink-0'>{startOfTrack}</div>}
                    {short && <PhaseTrack phase={phase} inline />}
                    {text}
                    {chips}
                    {corner}
                    {short && <div className='shrink-0'>{endOfTrack}</div>}
                </div>
            )}
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
                <MorePanel
                    promptText={promptText}
                    buttons={buttons}
                    onPress={press}
                    onClose={() => setMoreOpen(false)}
                >
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
};

export default PromptBar;
