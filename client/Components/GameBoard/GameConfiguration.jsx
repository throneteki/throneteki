import React from 'react';
import Group from '../Site/Group';
import PhaseTrack from '../Site/PhaseTrack';
import RadioField, { RadioOption } from '../Site/RadioField';
import SettingSwitch from '../Site/SettingSwitch';
import { CardSizeOptions } from '../../constants';

const tileClassName =
    'w-full cursor-pointer rounded-sm border border-gold-hair p-2 hover:bg-quiet data-[selected=true]:border-gold data-[selected=true]:bg-quiet';

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
}) => (
    <div className='flex flex-col gap-7 pb-4'>
        <Group
            title='Action windows'
            description='The game stops at the windows you choose to ask whether you want to act. These apply to this game; your defaults are in your profile.'
        >
            <PhaseTrack
                idPrefix='game-window'
                value={actionWindows}
                isDisabled={isSpectating}
                onChange={(name, isSelected) => onActionWindowToggle?.(name, isSelected)}
            />
        </Group>
        <Group title='Automation' description='Choices the game can make for you.'>
            <SettingSwitch
                label='Choose order of keywords'
                hint='When you are first player, pick the order challenge keywords resolve in.'
                isSelected={keywordSettings.chooseOrder}
                isDisabled={isSpectating}
                onValueChange={(value) => onKeywordSettingToggle?.('chooseOrder', value)}
            />
            <SettingSwitch
                label='Ask before resolving challenge keywords'
                hint='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                isSelected={keywordSettings.chooseCards}
                isDisabled={isSpectating}
                onValueChange={(value) => onKeywordSettingToggle?.('chooseCards', value)}
            />
            <SettingSwitch
                label='Prompt before using dupes to save'
                hint='Otherwise a duplicate saves your card automatically.'
                isSelected={promptDupes}
                isDisabled={isSpectating}
                onValueChange={(value) => onPromptDupesToggle?.(value)}
            />
        </Group>
        <Group
            title='Hidden information'
            description="Pause at windows where you could have a response, even when you don't, so your opponent can't tell what is in your hand."
        >
            <SettingSwitch
                label='Hide whether I have interrupts'
                isSelected={hideInterrupts !== false}
                isDisabled={isSpectating}
                onValueChange={(value) => onHideResponsesToggle?.('interrupts', value)}
            />
            <SettingSwitch
                label='Hide whether I have reactions'
                isSelected={hideReactions !== false}
                isDisabled={isSpectating}
                onValueChange={(value) => onHideResponsesToggle?.('reactions', value)}
            />
        </Group>
        <Group title='Card size'>
            <RadioField
                aria-label='Card size'
                value={cardSizeSetting}
                onChange={(value) => onCardSizeSettingChange?.(value)}
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

export default GameConfiguration;
