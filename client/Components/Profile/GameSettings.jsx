import React from 'react';
import Panel from '../Site/Panel';
import { Switch } from '@heroui/react';

const GameSettings = ({ formProps }) => {
    return (
        <Panel title='Game Settings'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <Switch
                    {...formProps.getFieldProps('chooseOrder')}
                    isSelected={formProps.values.chooseOrder}
                >
                    Choose order of keywords
                </Switch>
                <Switch
                    {...formProps.getFieldProps('chooseCards')}
                    isSelected={formProps.values.chooseCards}
                >
                    Ask before resolving challenge keywords
                </Switch>
                <Switch
                    {...formProps.getFieldProps('promptDupes')}
                    isSelected={formProps.values.promptDupes}
                >
                    Prompt before using dupes to save
                </Switch>
                <Switch
                    {...formProps.getFieldProps('hideInterrupts')}
                    isSelected={formProps.values.hideInterrupts}
                >
                    Hide whether I have interrupts
                </Switch>
                <Switch
                    {...formProps.getFieldProps('hideReactions')}
                    isSelected={formProps.values.hideReactions}
                >
                    Hide whether I have reactions
                </Switch>
                <Switch
                    {...formProps.getFieldProps('keyboardShortcuts')}
                    isSelected={formProps.values.keyboardShortcuts}
                >
                    Keyboard shortcuts in games
                </Switch>
            </div>
        </Panel>
    );
};

export default GameSettings;
