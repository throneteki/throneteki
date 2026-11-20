import React from 'react';
import SettingsGroup from './SettingsGroup';
import SettingSwitch from './SettingSwitch';
import ActionWindowSettings from './ActionWindowSettings';

const GameplaySettings = ({ formProps }) => {
    const { values, setFieldValue } = formProps;
    const toggle = (name) => (isSelected) => setFieldValue(name, isSelected);

    return (
        <>
            <ActionWindowSettings
                description='Choose where the game stops to ask whether you want to take an action. Anywhere else you pass automatically, and a window nobody stops in (such as dominance) may be skipped. You can also change these during a game from the settings button.'
                values={values.actionWindows}
                onToggle={(name, isSelected) => setFieldValue(`actionWindows.${name}`, isSelected)}
            />
            <SettingsGroup title='Automation'>
                <SettingSwitch
                    label='Choose order of keywords'
                    description='When you are first player, pick the order challenge keywords resolve in.'
                    isSelected={values.chooseOrder}
                    onValueChange={toggle('chooseOrder')}
                />
                <SettingSwitch
                    label='Ask before resolving challenge keywords'
                    description='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                    isSelected={values.chooseCards}
                    onValueChange={toggle('chooseCards')}
                />
                <SettingSwitch
                    label='Prompt before using dupes to save'
                    description='Otherwise a duplicate saves your card automatically.'
                    isSelected={values.promptDupes}
                    onValueChange={toggle('promptDupes')}
                />
            </SettingsGroup>
            <SettingsGroup
                title='Hidden information'
                description="Pause at windows where you could have a response, even when you don't, so your opponent can't tell what is in your hand."
            >
                <SettingSwitch
                    label='Hide whether I have interrupts'
                    isSelected={values.hideInterrupts}
                    onValueChange={toggle('hideInterrupts')}
                />
                <SettingSwitch
                    label='Hide whether I have reactions'
                    isSelected={values.hideReactions}
                    onValueChange={toggle('hideReactions')}
                />
            </SettingsGroup>
            <SettingsGroup title='Controls'>
                <SettingSwitch
                    label='Keyboard shortcuts in games'
                    description='Press ? during a game to see them.'
                    isSelected={values.keyboardShortcuts}
                    onValueChange={toggle('keyboardShortcuts')}
                />
            </SettingsGroup>
        </>
    );
};

export default GameplaySettings;
