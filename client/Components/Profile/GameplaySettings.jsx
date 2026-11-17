import React from 'react';
import { Switch } from '@heroui/react';
import SettingsGroup from './SettingsGroup';
import SettingSwitch from './SettingSwitch';
import { ActionWindows } from '../../constants';

const GameplaySettings = ({ formProps }) => {
    const { values, setFieldValue } = formProps;
    const toggle = (name) => (isSelected) => setFieldValue(name, isSelected);

    return (
        <>
            <SettingsGroup
                title='Action windows'
                description='Choose where the game stops to ask whether you want to take an action. Anywhere else you pass automatically, and a window nobody stops in (such as dominance) may be skipped. You can also change these during a game from the settings button.'
                className='grid gap-2 p-3 sm:grid-cols-3'
            >
                {ActionWindows.map((window) => (
                    <Switch
                        key={window.name}
                        size='sm'
                        isSelected={values.actionWindows[window.name]}
                        onValueChange={toggle(`actionWindows.${window.name}`)}
                        classNames={{
                            base: 'm-0 inline-flex w-full max-w-full cursor-pointer flex-row-reverse items-center justify-between gap-2 rounded-medium border border-default-200 px-3 py-2 hover:bg-default-100/50 data-[selected=true]:border-primary',
                            label: 'ms-0 text-small'
                        }}
                    >
                        {window.label}
                    </Switch>
                ))}
            </SettingsGroup>
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
