import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button, Slider } from '@heroui/react';
import CardImage from '../Images/CardImage';
import PlayerStats from '../GameBoard/Classic/PlayerStats';
import PlayerStatsBar from '../GameBoard/Adaptive/PlayerStatsBar';
import PhaseRoll from '../GameBoard/Adaptive/PhaseRoll';
import { chipClass } from '../GameBoard/Adaptive/chipClass';
import Group from '../Site/Group';
import SettingSwitch from '../Site/SettingSwitch';
import RadioField, { RadioOption, tileClassName } from '../Site/RadioField';
import Tag from '../Site/Tag';
import { useBrowserReducedMotion } from '../../motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { overlaySettingsOf, resolveHudSize } from '../../hud';
import SettingReveal from './SettingReveal';
import { interfaceScaleProperties } from '../GameBoard/useHudScale';
import { boardScales, estimateBoardMeasure, sliderRanges } from '../GameBoard/boardScales';

const previewCards = ['01144', '01089', '01160', 'cardback'];

const previewStats = { totalPower: 4, gold: 5, initiative: 1, claim: 1, reserve: 6 };

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

// The scales the board would draw at, worked out as the board works them out, against the room a board would have
// in this window with nothing in play
const previewScales = (hud, screen) => boardScales(hud, estimateBoardMeasure(hud, screen));

const Choice = ({ label, description, children }) => (
    <div className='flex flex-col gap-2 py-3'>
        <div className='flex flex-col'>
            <span className='text-base text-ink'>{label}</span>
            {description && <span className='text-sm text-ink-faint'>{description}</span>}
        </div>
        {children}
    </div>
);

const PreviewBox = ({ kind, style, children }) => (
    <div
        aria-hidden
        style={style}
        className={classNames(
            'pointer-events-none flex max-h-72 min-h-36 items-center overflow-hidden rounded bg-well p-3 [justify-content:safe_center]',
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
    <div className='hud-zoom w-56 border border-gold-line bg-panel/95 text-center'>
        <div className='border-b border-gold-hair px-2 py-1 font-display text-sm font-semibold text-gold'>
            Marshaling phase
        </div>
        <div className='px-2 pb-2'>
            <p className='my-1 text-sm text-ink'>Marshal your cards</p>
            <span
                className={classNames(
                    chipClass(false),
                    'flex h-8 items-center justify-center text-sm'
                )}
            >
                Done
            </span>
        </div>
    </div>
);

const AdaptivePrompt = () => (
    <div className='hud-zoom w-80 border-y border-gold-line bg-panel/90'>
        <div className='px-2 pt-1'>
            <PhaseRoll phase='marshal' className='w-full' />
        </div>
        <div className='mx-auto mt-1 h-px w-4/5 bg-gold-hair' />
        <div className='flex flex-col items-center gap-1 px-2 py-1'>
            <div className='text-center text-sm font-medium leading-snug text-ink'>
                <div className='text-xs font-normal leading-tight text-ink-dim'>Marshaling</div>
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

// The slider scales the fit to the screen. It moves freely while dragged, and the size is only changed once it is let
// go, so a game is not refitted (and sent to the server) at every step.
const SizeSlider = ({ kind, label, description, value, onChange, wontFit, preview }) => {
    const { min, max } = sliderRanges[kind];
    const saved = resolveHudSize(kind, value);
    const [draft, setDraft] = useState(null);
    const shown = draft ?? saved;
    const scaleOf = (next) => (Array.isArray(next) ? next[0] : next);
    const commit = (scale) => {
        setDraft(null);
        onChange(String(Math.round(scale * 100) / 100));
    };

    return (
        <div className='flex min-w-0 flex-col gap-2'>
            <WontFit show={wontFit(shown)} />
            <div className='flex items-start justify-between gap-2'>
                <div className='flex flex-col'>
                    <span className='text-base text-ink'>{label}</span>
                    <span className='text-sm text-ink-faint'>{description}</span>
                </div>
                <div className='flex shrink-0 items-center gap-1'>
                    <span className='text-sm tabular-nums text-ink-dim'>{percent(shown)}</span>
                    <Button
                        size='sm'
                        variant='ghost'
                        isDisabled={shown === 1}
                        onPress={() => commit(1)}
                    >
                        Reset
                    </Button>
                </div>
            </div>
            <Slider
                aria-label={`${label} size`}
                step={0.05}
                minValue={min}
                maxValue={max}
                value={Math.min(max, Math.max(min, shown))}
                onChange={(next) => setDraft(scaleOf(next))}
                onChangeEnd={(next) => commit(scaleOf(next))}
            >
                <Slider.Track>
                    <Slider.Fill />
                    <Slider.Thumb />
                </Slider.Track>
            </Slider>
            {preview(shown)}
        </div>
    );
};

// Shown on the slider whose size makes the cards' rows taller than the board
const WontFit = ({ show }) => (
    <SettingReveal show={show}>
        <div
            role='status'
            className='flex items-center gap-2 rounded border border-warning/40 px-3 py-1.5 text-sm text-warning'
        >
            <FontAwesomeIcon icon={faExclamationTriangle} className='shrink-0' />
            <span>
                Card rows may not fit the height of the screen, so the board would scroll up and
                down. Lower this size to avoid it.
            </span>
        </div>
    </SettingReveal>
);

const experimentalChip = (
    <Tag tone='warning' className='shrink-0'>
        Experimental
    </Tag>
);

// Tagged at the right end of a tile's title line
const Experimental = ({ children }) => (
    <span className='flex w-full items-start justify-between gap-2'>
        <span className='min-w-0'>{children}</span>
        {experimentalChip}
    </span>
);

const TileText = ({ description, children }) => (
    <span className='flex min-w-0 flex-1 flex-col'>
        {children}
        <span className='text-xs text-ink-faint'>{description}</span>
    </span>
);

// The board's own settings, in the profile
const HudSettings = ({ value, onChange }) => {
    const update = (changes) => onChange && onChange({ ...value, ...changes });
    const overlays = overlaySettingsOf(value);
    const reducedMotion = useBrowserReducedMotion();
    const screen = useScreen();
    const scalesFor = (kind, scale) => previewScales({ ...value, [kind]: String(scale) }, screen);

    return (
        <>
            <Group title='Game board'>
                <Choice label='Layout'>
                    <RadioField
                        aria-label='Board layout'
                        value={value.board}
                        onChange={(board) => update({ board })}
                        optionsClassName='grid gap-2 sm:grid-cols-2'
                    >
                        <RadioOption
                            value='classic'
                            className={tileClassName}
                            contentClassName='items-start'
                        >
                            <TileText description="Designed for desktop and laptop screens. It works on a phone, but isn't laid out for one.">
                                Classic
                            </TileText>
                        </RadioOption>
                        <RadioOption
                            value='adaptive'
                            className={tileClassName}
                            contentClassName='items-start'
                        >
                            <TileText description='Rearranges itself to suit any screen: a phone or tablet in portrait or landscape, or a desktop.'>
                                <Experimental>Adaptive</Experimental>
                            </TileText>
                        </RadioOption>
                    </RadioField>
                </Choice>
            </Group>
            <Group
                title='Board effects'
                description='Touches that make the game feel more alive. They change only how it looks: turning them off takes nothing away from how you play.'
                badge={experimentalChip}
            >
                <SettingSwitch
                    label='Animate the game board'
                    hint={
                        reducedMotion
                            ? 'Your browser asks for reduced motion, so animations stay off.'
                            : 'Cards and effects move between states instead of changing instantly.'
                    }
                    isSelected={value.animations !== false}
                    onValueChange={(animations) => update({ animations })}
                />
                <SettingReveal show={value.board === 'adaptive'}>
                    <SettingSwitch
                        label='Show board overlays'
                        hint='Key moments and selections during the game play out over the board.'
                        isSelected={overlays.enabled}
                        onValueChange={(enabled) => update({ overlays: enabled })}
                    />
                </SettingReveal>
            </Group>
            <Group
                title='Sizes'
                description='The board is sized to fit your screen; these scale that fit. The previews show how the board will look on this screen once saved.'
            >
                <div className='grid gap-6'>
                    <SizeSlider
                        kind='cards'
                        label='Cards'
                        description='Card images, piles and counters.'
                        value={value.cards}
                        onChange={(cards) => update({ cards })}
                        wontFit={(scale) => scalesFor('cards', scale).overflow === 'cards'}
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
                        onChange={(size) => update({ interface: size })}
                        wontFit={(scale) => scalesFor('interface', scale).overflow === 'interface'}
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
            </Group>
        </>
    );
};

export default HudSettings;
