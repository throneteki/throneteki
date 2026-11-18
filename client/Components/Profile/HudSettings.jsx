import React from 'react';
import { Radio, RadioGroup, Slider, Switch } from '@heroui/react';
import Panel from '../Site/Panel';
import { useBrowserReducedMotion } from '../../motion';
import { hudSizeNames, hudSizeRange, resolveHudSize } from '../../hud';

const groups = [
    { kind: 'cards', label: 'Cards', description: 'Card images, piles and counters' },
    {
        kind: 'interface',
        label: 'Interface',
        description: 'Player bar, prompt, chat, popups and all text'
    }
];

const sizeOptions = [
    ...hudSizeNames.map((name) => ({ name, label: name[0].toUpperCase() + name.slice(1) })),
    { name: 'custom', label: 'Custom' }
];

const defaultCustomScale = { cards: 1.25, interface: 1.1 };

const radioValue = (value) => (hudSizeNames.includes(value) ? value : 'custom');

const SizeGroup = ({ kind, label, description, value, onChange }) => {
    const selected = radioValue(value);
    const { min, max } = hudSizeRange(kind);
    const customScale =
        selected === 'custom' ? resolveHudSize(kind, value) : defaultCustomScale[kind];

    return (
        <div className='flex flex-col gap-2'>
            <div>
                <div className='font-bold'>{label}</div>
                <div className='text-xs text-default-500 min-h-[2em]'>{description}</div>
            </div>
            <RadioGroup
                aria-label={`${label} size`}
                value={selected}
                size='sm'
                onValueChange={(next) => onChange(next === 'custom' ? String(customScale) : next)}
            >
                {sizeOptions.map(({ name, label: optionLabel }) => (
                    <Radio key={name} value={name}>
                        {optionLabel}
                    </Radio>
                ))}
            </RadioGroup>
            {selected === 'custom' && (
                <Slider
                    aria-label={`Custom ${label.toLowerCase()} size`}
                    size='sm'
                    step={0.05}
                    minValue={min}
                    maxValue={max}
                    value={customScale}
                    getValue={(scale) => `${Math.round(scale * 100)}%`}
                    onChange={(next) => onChange(String(next))}
                />
            )}
        </div>
    );
};

const HudSettings = ({ value, onChange }) => {
    const update = (changes) => onChange && onChange({ ...value, ...changes });
    const reducedMotion = useBrowserReducedMotion();

    return (
        <Panel title='HUD Settings'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <div>
                        <div className='font-bold'>Board layout</div>
                        <div className='text-xs text-default-500'>
                            The adaptive board rearranges itself to fit phones and tablets in either
                            orientation. It is experimental.
                        </div>
                    </div>
                    <RadioGroup
                        aria-label='Board layout'
                        orientation='horizontal'
                        size='sm'
                        value={value.board}
                        onValueChange={(board) => update({ board })}
                    >
                        <Radio value='classic'>Classic</Radio>
                        <Radio value='adaptive'>Adaptive (experimental)</Radio>
                    </RadioGroup>
                </div>
                <div className='flex flex-col gap-2'>
                    <div>
                        <div className='font-bold'>Prompt position</div>
                        <div className='text-xs text-default-500'>
                            Which side of the board the prompt and its buttons sit on. On a phone
                            held upright the prompt runs across the middle instead.
                        </div>
                    </div>
                    <RadioGroup
                        aria-label='Prompt position'
                        orientation='horizontal'
                        size='sm'
                        value={value.promptSide || 'left'}
                        onValueChange={(promptSide) => update({ promptSide })}
                    >
                        <Radio value='left'>Left</Radio>
                        <Radio value='right'>Right</Radio>
                    </RadioGroup>
                </div>
                {value.board === 'adaptive' && (
                    <Switch
                        isSelected={value.followAction !== false}
                        onValueChange={(followAction) => update({ followAction })}
                    >
                        <div>Follow the action in melee</div>
                        <div className='text-xs text-default-500'>
                            Scrolls the table to the player whose turn it is, or whose cards you are
                            choosing.
                        </div>
                    </Switch>
                )}
                <Switch isSelected={value.auto} onValueChange={(auto) => update({ auto })}>
                    <div>Scale with screen</div>
                    <div className='text-xs text-default-500'>
                        Combines the sizes below with your screen size: smaller on phones, larger on
                        big monitors.
                    </div>
                </Switch>
                <Switch
                    isSelected={value.animations !== false}
                    onValueChange={(animations) => update({ animations })}
                >
                    <div>Animate the gameboard</div>
                    <div className='text-xs text-default-500'>
                        {reducedMotion
                            ? 'Your browser asks for reduced motion, so animations stay off.'
                            : 'Cards and effects move between states instead of changing instantly.'}
                    </div>
                </Switch>
                <div className='grid gap-4 sm:grid-cols-2'>
                    {groups.map((group) => (
                        <SizeGroup
                            key={group.kind}
                            {...group}
                            value={value[group.kind]}
                            onChange={(size) => update({ [group.kind]: size })}
                        />
                    ))}
                </div>
            </div>
        </Panel>
    );
};

export default HudSettings;
