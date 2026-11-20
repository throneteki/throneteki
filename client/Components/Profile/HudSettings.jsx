import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button, Chip, Radio, RadioGroup, Slider } from '@heroui/react';
import CardImage from '../Images/CardImage';
import PlayerStats from '../GameBoard/Classic/PlayerStats';
import PlayerStatsBar from '../GameBoard/Adaptive/PlayerStatsBar';
import PhaseRoll from '../GameBoard/Adaptive/PhaseRoll';
import { chipClass } from '../GameBoard/Adaptive/PromptBar';
import SettingsGroup, { tileClassNames } from './SettingsGroup';
import SettingSwitch from './SettingSwitch';
import { useBrowserReducedMotion } from '../../motion';
import { motion } from 'framer-motion';
import { resolveHudSize } from '../../hud';
import { interfaceScaleProperties } from '../GameBoard/useHudScale';
import { boardMeasure, boardScales, estimateBoardMeasure } from '../GameBoard/boardScales';

const sliderRanges = { cards: { min: 0.5, max: 3 }, interface: { min: 0.6, max: 2 } };

const fixedSizes = {
    cards: [0.5, 0.7, 1, 1.4, 2, 3],
    interface: [0.7, 0.85, 1, 1.2, 1.5]
};
const fixedSizeNames = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];

const previewCards = ['01144', '01089', '01160', 'cardback'];

const previewStats = { totalPower: 4, gold: 5, initiative: 1, claim: 1, reserve: 6 };

const describedTileClassNames = {
    ...tileClassNames,
    base: classNames(tileClassNames.base, 'items-start'),
    description: 'text-tiny text-default-500'
};

const percent = (scale) => `${Math.round(scale * 100)}%`;

const useScreen = () => {
    const measure = () => ({ width: window.innerWidth, height: window.innerHeight });
    const [screen, setScreen] = useState(measure);
    useEffect(() => {
        const update = () => setScreen(measure());
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    return screen;
};

// The scales the board would draw at, worked out as the board works them out: in a game against the board as it
// was last measured, otherwise against the room a board would have in this window, with nothing in play
const previewScales = (hud, screen, inGame) =>
    boardScales(hud, (inGame && boardMeasure()) || estimateBoardMeasure(hud, screen));

const Choice = ({ label, description, children }) => (
    <div className='flex flex-col gap-2 px-3 py-2.5'>
        <div className='flex flex-col gap-0.5'>
            <span className='text-medium'>{label}</span>
            {description && <span className='text-small text-default-500'>{description}</span>}
        </div>
        {children}
    </div>
);

const PreviewBox = ({ kind, style, children }) => (
    <div
        aria-hidden
        style={style}
        className={classNames(
            'pointer-events-none flex max-h-72 min-h-36 items-center overflow-hidden rounded-medium bg-black/40 p-3 [justify-content:safe_center]',
            kind === 'cards' ? 'preview-cards' : 'preview-interface'
        )}
    >
        {children}
    </div>
);

const CardPreview = () => (
    <div className='flex items-end gap-2'>
        {previewCards.map((code) => (
            <CardImage key={code} code={code} className='shrink-0' />
        ))}
    </div>
);

const ClassicPrompt = () => (
    <div className='hud-zoom w-56 text-center'>
        <div className='rounded-t-md border-1 border-default-200 bg-secondary-200 py-1 text-small font-bold uppercase'>
            Marshaling phase
        </div>
        <div className='rounded-b-md border-1 border-default-200 bg-black/65 px-2 pb-2'>
            <p className='my-1 text-small'>Marshal your cards</p>
            <span className='flex h-8 items-center justify-center rounded-small bg-primary text-small text-primary-foreground'>
                Done
            </span>
        </div>
    </div>
);

const AdaptivePrompt = () => (
    <div className='hud-zoom w-80 border-y border-default-200/60 bg-black/60'>
        <div className='px-2 pt-1'>
            <PhaseRoll phase='marshal' className='w-full' />
        </div>
        <div className='mx-auto mt-1 h-px w-4/5 bg-gradient-to-r from-transparent via-default-400/50 to-transparent' />
        <div className='flex flex-col items-center gap-1 px-2 py-1'>
            <div className='text-center text-sm font-semibold leading-snug'>
                <div className='text-[10px] font-normal uppercase leading-tight tracking-wider text-default-500'>
                    Marshaling
                </div>
                Marshal your cards
            </div>
            <span className={classNames(chipClass(false), 'inline-flex h-7 items-center')}>
                Done
            </span>
        </div>
    </div>
);

// Our player bar and a prompt, as the chosen board draws them
const InterfacePreview = ({ board }) => {
    const username = useSelector((state) => state.auth.user?.username);
    const player = { user: { username }, stats: previewStats };

    return (
        <div className='flex w-max flex-col gap-2'>
            {board === 'adaptive' ? (
                <>
                    <PlayerStatsBar player={player} className='!z-0' />
                    <AdaptivePrompt />
                </>
            ) : (
                <>
                    <PlayerStats user={player.user} stats={previewStats} />
                    <ClassicPrompt />
                </>
            )}
        </div>
    );
};

const nearestIndex = (sizes, scale) =>
    sizes.reduce(
        (best, size, index) =>
            Math.abs(size - scale) < Math.abs(sizes[best] - scale) ? index : best,
        0
    );

// A size saved off the named steps (from before they were named) sits at the nearest step, unnamed, until moved
const stepMarks = (sizes, scale) =>
    sizes.map((size, index) => ({
        value: index,
        label: Math.abs(size - scale) < 0.001 ? fixedSizeNames[index] : ''
    }));

// The slider moves freely while dragged, and the size is only changed once it is let go, so a game is not refitted
// (and sent to the server) at every step. Fixed, it steps between named sizes; fitted, it scales the fit smoothly.
const SizeSlider = ({ kind, label, description, value, fixed, onChange, preview }) => {
    const { min, max } = sliderRanges[kind];
    const sizes = fixedSizes[kind];
    const saved = resolveHudSize(kind, value);
    const [draft, setDraft] = useState(null);
    const shown = draft ?? saved;
    const scaleOf = (next) => (Array.isArray(next) ? next[0] : next);
    const commit = (scale) => {
        setDraft(null);
        onChange(String(Math.round(scale * 100) / 100));
    };
    const sliderProps = fixed
        ? {
              step: 1,
              minValue: 0,
              maxValue: sizes.length - 1,
              showSteps: true,
              value: nearestIndex(sizes, shown),
              marks: stepMarks(sizes, shown),
              onChange: (next) => setDraft(sizes[scaleOf(next)]),
              onChangeEnd: (next) => commit(sizes[scaleOf(next)])
          }
        : {
              step: 0.05,
              minValue: min,
              maxValue: max,
              value: Math.min(max, Math.max(min, shown)),
              onChange: (next) => setDraft(scaleOf(next)),
              onChangeEnd: (next) => commit(scaleOf(next))
          };

    return (
        <div className='flex min-w-0 flex-col gap-2'>
            <div className='flex items-start justify-between gap-2'>
                <div className='flex flex-col gap-0.5'>
                    <span className='text-medium'>{label}</span>
                    <span className='text-small text-default-500'>{description}</span>
                </div>
                <div className='flex shrink-0 items-center gap-1'>
                    <span className='text-small tabular-nums'>{percent(shown)}</span>
                    <Button
                        size='sm'
                        variant='light'
                        isDisabled={shown === 1}
                        onPress={() => commit(1)}
                    >
                        Reset
                    </Button>
                </div>
            </div>
            <motion.div
                key={fixed ? 'fixed' : 'fit'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
            >
                <Slider
                    aria-label={`${label} size`}
                    size='sm'
                    hideValue
                    classNames={{
                        mark: '!opacity-100 pointer-events-none whitespace-nowrap text-tiny'
                    }}
                    {...sliderProps}
                />
            </motion.div>
            {preview(shown)}
        </div>
    );
};

// The board's own settings, shared by the profile and the game (inGame), where the previews are sized against the
// board in play
const HudSettings = ({ value, onChange, inGame = false }) => {
    const update = (changes) => onChange && onChange({ ...value, ...changes });
    const reducedMotion = useBrowserReducedMotion();
    const screen = useScreen();
    const scalesFor = (kind, scale) =>
        previewScales({ ...value, [kind]: String(scale) }, screen, inGame);

    return (
        <>
            <SettingsGroup title='Game board'>
                <Choice label='Layout'>
                    <RadioGroup
                        aria-label='Board layout'
                        value={value.board}
                        onValueChange={(board) => update({ board })}
                        classNames={{ wrapper: 'grid gap-2 sm:grid-cols-2' }}
                    >
                        <Radio
                            value='classic'
                            description="Designed for desktop and laptop screens. It works on a phone, but isn't laid out for one."
                            classNames={describedTileClassNames}
                        >
                            Classic
                        </Radio>
                        <Radio
                            value='adaptive'
                            description='Rearranges itself to suit any screen: a phone or tablet in portrait or landscape, or a desktop.'
                            classNames={describedTileClassNames}
                        >
                            <span className='flex items-center gap-2'>
                                Adaptive
                                <Chip size='sm' color='warning' variant='flat'>
                                    Experimental
                                </Chip>
                            </span>
                        </Radio>
                    </RadioGroup>
                </Choice>
                <Choice
                    label='Prompt position'
                    description='Which side of the board the prompt and its buttons sit on in a landscape view.'
                >
                    <RadioGroup
                        aria-label='Prompt position'
                        value={value.promptSide || 'left'}
                        onValueChange={(promptSide) => update({ promptSide })}
                        classNames={{ wrapper: 'grid grid-cols-2 gap-2' }}
                    >
                        <Radio value='left' classNames={tileClassNames}>
                            Left
                        </Radio>
                        <Radio value='right' classNames={tileClassNames}>
                            Right
                        </Radio>
                    </RadioGroup>
                </Choice>
                <SettingSwitch
                    label='Animate the game board'
                    description={
                        reducedMotion
                            ? 'Your browser asks for reduced motion, so animations stay off.'
                            : 'Cards and effects move between states instead of changing instantly.'
                    }
                    isSelected={value.animations !== false}
                    onValueChange={(animations) => update({ animations })}
                />
            </SettingsGroup>
            <SettingsGroup
                title='Sizes'
                description='The previews show how the board will look on this screen once saved.'
            >
                <Choice label='Sizing'>
                    <RadioGroup
                        aria-label='Sizing'
                        value={value.auto ? 'fit' : 'fixed'}
                        onValueChange={(sizing) => update({ auto: sizing === 'fit' })}
                        classNames={{ wrapper: 'grid gap-2 sm:grid-cols-2' }}
                    >
                        <Radio
                            value='fixed'
                            description='The sliders set the sizes, whatever the screen.'
                            classNames={describedTileClassNames}
                        >
                            Fixed size
                        </Radio>
                        <Radio
                            value='fit'
                            description='Sized to your screen; the sliders scale the fit.'
                            classNames={describedTileClassNames}
                        >
                            <span className='flex items-center gap-2'>
                                Fit to screen
                                <Chip size='sm' color='warning' variant='flat'>
                                    Experimental
                                </Chip>
                            </span>
                        </Radio>
                    </RadioGroup>
                </Choice>
                <div className='grid gap-4 p-3 sm:grid-cols-2'>
                    <SizeSlider
                        kind='cards'
                        label='Cards'
                        description='Card images, piles and counters.'
                        value={value.cards}
                        fixed={!value.auto}
                        onChange={(cards) => update({ cards })}
                        preview={(scale) => (
                            <PreviewBox
                                kind='cards'
                                style={{ '--card-scale': scalesFor('cards', scale).cards }}
                            >
                                <CardPreview />
                            </PreviewBox>
                        )}
                    />
                    <SizeSlider
                        kind='interface'
                        label='Interface'
                        description='Player bar, prompt, chat, popups and all text.'
                        value={value.interface}
                        fixed={!value.auto}
                        onChange={(size) => update({ interface: size })}
                        preview={(scale) => (
                            <PreviewBox
                                kind='interface'
                                style={interfaceScaleProperties(
                                    scalesFor('interface', scale).interface
                                )}
                            >
                                <InterfacePreview board={value.board} />
                            </PreviewBox>
                        )}
                    />
                </div>
            </SettingsGroup>
        </>
    );
};

export default HudSettings;
