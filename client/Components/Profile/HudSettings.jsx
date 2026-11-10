import React from 'react';
import { Radio, RadioGroup, Slider, Switch } from '@heroui/react';
import Panel from '../Site/Panel';
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

    return (
        <Panel title='HUD Settings'>
            <div className='flex flex-col gap-4'>
                <Switch isSelected={value.auto} onValueChange={(auto) => update({ auto })}>
                    <div>Scale with screen</div>
                    <div className='text-xs text-default-500'>
                        Combines the sizes below with your screen size: smaller on phones, larger on
                        big monitors.
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
