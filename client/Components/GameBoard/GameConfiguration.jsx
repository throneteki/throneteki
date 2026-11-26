import React, { useEffect, useMemo, useState } from 'react';
import Group from '../Site/Group';
import PhaseTrack from '../Site/PhaseTrack';
import RadioField, { RadioOption } from '../Site/RadioField';
import SettingSwitch from '../Site/SettingSwitch';
import { CardSizeOptions } from '../../constants';

const tileClassName =
    'w-full cursor-pointer rounded-sm border border-gold-hair p-2 hover:bg-quiet data-[selected=true]:border-gold data-[selected=true]:bg-quiet';

// Settings only change in the game state once the server has applied them, so a change is shown
// straight away and kept until the server's value catches up. Without this, clicking again
// before the reply sends the old value a second time.
const usePendingSettings = (serverValues) => {
    const [pending, setPending] = useState({});

    useEffect(() => {
        setPending((current) => {
            const stillPending = Object.fromEntries(
                Object.entries(current).filter(([key, value]) => serverValues[key] !== value)
            );

            return Object.keys(stillPending).length === Object.keys(current).length
                ? current
                : stillPending;
        });
    }, [serverValues]);

    const valueOf = (key) => (key in pending ? pending[key] : serverValues[key]);
    const change = (key, value, send) => {
        setPending((current) => ({ ...current, [key]: value }));
        send?.(value);
    };

    return [valueOf, change];
};

const GameConfiguration = ({
    isSpectating,
    actionWindows,
    keywordSettings,
    promptDupes,
    hideInterrupts,
    hideReactions,
    cardSizeSetting,
    onKeywordSettingToggle,
    onHideResponsesToggle,
    onCardSizeSettingChange,
    onActionWindowToggle,
    onPromptDupesToggle
}) => {
    const serverValues = {
        ...Object.fromEntries(
            Object.entries(actionWindows ?? {}).map(([name, value]) => [`window.${name}`, value])
        ),
        chooseOrder: !!keywordSettings?.chooseOrder,
        chooseCards: !!keywordSettings?.chooseCards,
        promptDupes: !!promptDupes,
        hideInterrupts: hideInterrupts !== false,
        hideReactions: hideReactions !== false,
        cardSize: cardSizeSetting
    };
    const serverKey = JSON.stringify(serverValues);
    const stableServerValues = useMemo(() => JSON.parse(serverKey), [serverKey]);

    const [valueOf, change] = usePendingSettings(stableServerValues);

    const windowValues = Object.fromEntries(
        Object.keys(actionWindows ?? {}).map((name) => [name, valueOf(`window.${name}`)])
    );

    return (
        <div className='flex flex-col gap-7 pb-4'>
            <Group
                title='Action windows'
                description='The game stops at the windows you choose to ask whether you want to act. These apply to this game; your defaults are in your profile.'
            >
                <PhaseTrack
                    idPrefix='game-window'
                    value={windowValues}
                    isDisabled={isSpectating}
                    onChange={(name, isSelected) =>
                        change(`window.${name}`, isSelected, (value) =>
                            onActionWindowToggle?.(name, value)
                        )
                    }
                />
            </Group>
            <Group title='Automation' description='Choices the game can make for you.'>
                <SettingSwitch
                    label='Choose order of keywords'
                    hint='When you are first player, pick the order challenge keywords resolve in.'
                    isSelected={valueOf('chooseOrder')}
                    isDisabled={isSpectating}
                    onValueChange={(value) =>
                        change('chooseOrder', value, (v) =>
                            onKeywordSettingToggle?.('chooseOrder', v)
                        )
                    }
                />
                <SettingSwitch
                    label='Ask before resolving challenge keywords'
                    hint='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                    isSelected={valueOf('chooseCards')}
                    isDisabled={isSpectating}
                    onValueChange={(value) =>
                        change('chooseCards', value, (v) =>
                            onKeywordSettingToggle?.('chooseCards', v)
                        )
                    }
                />
                <SettingSwitch
                    label='Prompt before using dupes to save'
                    hint='Otherwise a duplicate saves your card automatically.'
                    isSelected={valueOf('promptDupes')}
                    isDisabled={isSpectating}
                    onValueChange={(value) => change('promptDupes', value, onPromptDupesToggle)}
                />
            </Group>
            <Group
                title='Hidden information'
                description="Pause at windows where you could have a response, even when you don't, so your opponent can't tell what is in your hand."
            >
                <SettingSwitch
                    label='Hide whether I have interrupts'
                    isSelected={valueOf('hideInterrupts')}
                    isDisabled={isSpectating}
                    onValueChange={(value) =>
                        change('hideInterrupts', value, (v) =>
                            onHideResponsesToggle?.('interrupts', v)
                        )
                    }
                />
                <SettingSwitch
                    label='Hide whether I have reactions'
                    isSelected={valueOf('hideReactions')}
                    isDisabled={isSpectating}
                    onValueChange={(value) =>
                        change('hideReactions', value, (v) =>
                            onHideResponsesToggle?.('reactions', v)
                        )
                    }
                />
            </Group>
            <Group title='Card size'>
                <RadioField
                    aria-label='Card size'
                    value={valueOf('cardSize')}
                    onChange={(value) => change('cardSize', value, onCardSizeSettingChange)}
                    optionsClassName='grid grid-cols-2 gap-2 sm:grid-cols-4'
                >
                    {CardSizeOptions.map(({ name, label }) => (
                        <RadioOption key={name} value={name} className={tileClassName}>
                            {label}
                        </RadioOption>
                    ))}
                </RadioField>
            </Group>
        </div>
    );
};

export default GameConfiguration;
