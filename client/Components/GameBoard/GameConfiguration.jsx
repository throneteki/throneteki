import React from 'react';
import Group from '../Site/Group';
import PhaseTrack from '../Site/PhaseTrack';
import SettingSwitch from '../Site/SettingSwitch';

// This game's gameplay settings, laid out as the profile's are. values: the settings as changed so far; onChange is
// given the ones that change.
const GameConfiguration = ({ isSpectating, values, onChange }) => {
    const setKeyword = (name) => (value) =>
        onChange({ keywordSettings: { ...values.keywordSettings, [name]: value } });

    return (
        <div className='flex flex-col gap-7 pb-4'>
            <Group
                title='Action windows'
                description='The game stops at the windows you choose to ask whether you want to act.'
            >
                <PhaseTrack
                    idPrefix='game-window'
                    value={values.actionWindows}
                    isDisabled={isSpectating}
                    onChange={(name, isSelected) =>
                        onChange({ actionWindows: { ...values.actionWindows, [name]: isSelected } })
                    }
                />
            </Group>
            <Group title='Automation' description='Choices the game can make for you.'>
                <SettingSwitch
                    label='Choose order of keywords'
                    hint='When you are first player, pick the order challenge keywords resolve in.'
                    isSelected={!!values.keywordSettings?.chooseOrder}
                    isDisabled={isSpectating}
                    onValueChange={setKeyword('chooseOrder')}
                />
                <SettingSwitch
                    label='Ask before resolving challenge keywords'
                    hint='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                    isSelected={!!values.keywordSettings?.chooseCards}
                    isDisabled={isSpectating}
                    onValueChange={setKeyword('chooseCards')}
                />
                <SettingSwitch
                    label='Prompt before using dupes to save'
                    hint='Otherwise a duplicate saves your card automatically.'
                    isSelected={!!values.promptDupes}
                    isDisabled={isSpectating}
                    onValueChange={(promptDupes) => onChange({ promptDupes })}
                />
            </Group>
            <Group
                title='Hidden information'
                description="Pause at windows where you could have a response, even when you don't, so your opponent can't tell what is in your hand."
            >
                <SettingSwitch
                    label='Hide whether I have interrupts'
                    isSelected={values.hideInterrupts !== false}
                    isDisabled={isSpectating}
                    onValueChange={(hideInterrupts) => onChange({ hideInterrupts })}
                />
                <SettingSwitch
                    label='Hide whether I have reactions'
                    isSelected={values.hideReactions !== false}
                    isDisabled={isSpectating}
                    onValueChange={(hideReactions) => onChange({ hideReactions })}
                />
            </Group>
        </div>
    );
};

export default GameConfiguration;
