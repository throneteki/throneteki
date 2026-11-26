import React from 'react';
import Group from '../Site/Group';
import PhaseTrack from '../Site/PhaseTrack';
import SettingSwitch from '../Site/SettingSwitch';

const GameplaySettings = ({ formProps }) => {
    const { values, setFieldValue } = formProps;
    const toggle = (name) => (isSelected) => setFieldValue(name, isSelected);

    return (
        <>
            <Group
                title='Action windows'
                description='The game stops at the windows you choose to ask whether you want to act. Anywhere else you pass automatically, and a window nobody stops in (such as dominance) may be skipped. You can also change these during a game from the settings button.'
            >
                <PhaseTrack
                    idPrefix='profile-window'
                    value={values.actionWindows}
                    onChange={(name, isSelected) =>
                        setFieldValue(`actionWindows.${name}`, isSelected)
                    }
                />
            </Group>
            <Group title='Automation' description='Choices the game can make for you.'>
                <SettingSwitch
                    label='Choose order of keywords'
                    hint='When you are first player, pick the order challenge keywords resolve in.'
                    isSelected={values.chooseOrder}
                    onValueChange={toggle('chooseOrder')}
                />
                <SettingSwitch
                    label='Ask before resolving challenge keywords'
                    hint='Pick which of your cards resolve each keyword, instead of all of them resolving automatically.'
                    isSelected={values.chooseCards}
                    onValueChange={toggle('chooseCards')}
                />
                <SettingSwitch
                    label='Prompt before using dupes to save'
                    hint='Otherwise a duplicate saves your card automatically.'
                    isSelected={values.promptDupes}
                    onValueChange={toggle('promptDupes')}
                />
            </Group>
            <Group
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
            </Group>
            <Group title='Controls'>
                <SettingSwitch
                    label='Keyboard shortcuts in games'
                    hint='Press ? during a game to see them.'
                    isSelected={values.keyboardShortcuts}
                    onValueChange={toggle('keyboardShortcuts')}
                />
            </Group>
        </>
    );
};

export default GameplaySettings;
