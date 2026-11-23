import React from 'react';
import ActionWindowSettings from '../Profile/ActionWindowSettings';
import SettingsGroup from '../Profile/SettingsGroup';
import SettingSwitch from '../Profile/SettingSwitch';

// This game's gameplay settings, laid out as the profile's are. values: the settings as changed so far; onChange is
// given the ones that change.
const GameConfiguration = ({ isSpectating, values, onChange }) => {
    const setKeyword = (name) => (value) =>
        onChange({ keywordSettings: { ...values.keywordSettings, [name]: value } });

    return (
        <div className='flex flex-col gap-6'>
            <ActionWindowSettings
                description='Where the game stops to ask whether you want to take an action.'
                values={values.actionWindows}
                isDisabled={isSpectating}
                onToggle={(name, isSelected) =>
                    onChange({ actionWindows: { ...values.actionWindows, [name]: isSelected } })
                }
            />
            <SettingsGroup title='Automation'>
                <SettingSwitch
                    label='Choose order of keywords'
                    description='When you are first player, pick the order challenge keywords resolve in.'
                    isSelected={!!values.keywordSettings?.chooseOrder}
                    isDisabled={isSpectating}
                    onValueChange={setKeyword('chooseOrder')}
                />
                <SettingSwitch
                    label='Ask before resolving challenge keywords'
                    description='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                    isSelected={!!values.keywordSettings?.chooseCards}
                    isDisabled={isSpectating}
                    onValueChange={setKeyword('chooseCards')}
                />
                <SettingSwitch
                    label='Prompt before using dupes to save'
                    description='Otherwise a duplicate saves your card automatically.'
                    isSelected={!!values.promptDupes}
                    isDisabled={isSpectating}
                    onValueChange={(promptDupes) => onChange({ promptDupes })}
                />
            </SettingsGroup>
            <SettingsGroup
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
            </SettingsGroup>
        </div>
    );
};

export default GameConfiguration;
