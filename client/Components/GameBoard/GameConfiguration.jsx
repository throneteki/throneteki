import React from 'react';
import { Switch } from '@heroui/react';
import Panel from '../Site/Panel';

const windows = [
    { name: 'plot', label: 'Plots revealed' },
    { name: 'draw', label: 'Draw phase' },
    { name: 'challengeBegin', label: 'Before challenge' },
    { name: 'attackersDeclared', label: 'Attackers declared' },
    { name: 'defendersDeclared', label: 'Defenders declared' },
    { name: 'dominance', label: 'Dominance phase' },
    { name: 'standing', label: 'Standing phase' },
    { name: 'taxation', label: 'Taxation phase' }
];

const GameConfiguration = ({
    actionWindows,
    keywordSettings,
    promptDupes,
    timerSettings,
    onKeywordSettingToggle,
    onTimerSettingToggle,
    onActionWindowToggle,
    onPromptDupesToggle
}) => {
    const windowsToRender = windows.map((window) => {
        return (
            <div key={window.name}>
                <Switch
                    onValueChange={(checked) =>
                        onActionWindowToggle && onActionWindowToggle(window.name, checked)
                    }
                    name={'promptedActionWindows.' + window.name}
                    isSelected={actionWindows[window.name]}
                >
                    {window.label}
                </Switch>
            </div>
        );
    });

    return (
        <div>
            <form>
                <Panel title={'Action window defaults'}>
                    <div>{windowsToRender}</div>
                </Panel>
                <Panel title={'Timed interrupt window'} className='mt-3'>
                    <div>
                        <div>
                            <Switch
                                onValueChange={(value) =>
                                    onTimerSettingToggle && onTimerSettingToggle('events', value)
                                }
                                name='timerSettings.events'
                                isSelected={timerSettings.events}
                            >
                                {'Show timer for events'}
                            </Switch>
                        </div>
                        <div>
                            <Switch
                                onValueChange={(value) =>
                                    onTimerSettingToggle && onTimerSettingToggle('abilities', value)
                                }
                                name='timerSettings.abilities'
                                isSelected={timerSettings.abilities}
                            >
                                {'Show timer for card abilities'}
                            </Switch>
                        </div>
                    </div>
                </Panel>
                <Panel title={'Other Settings'} className='mt-3'>
                    <div>
                        <div>
                            <Switch
                                onValueChange={(value) =>
                                    onKeywordSettingToggle &&
                                    onKeywordSettingToggle('chooseOrder', value)
                                }
                                name='keywordSettings.chooseOrder'
                                isSelected={keywordSettings.chooseOrder}
                            >
                                {'Choose order of keywords'}
                            </Switch>
                        </div>
                        <div>
                            <Switch
                                onValueChange={(value) =>
                                    onKeywordSettingToggle &&
                                    onKeywordSettingToggle('chooseCards', value)
                                }
                                name='keywordSettings.chooseCards'
                                isSelected={keywordSettings.chooseCards}
                            >
                                {'Make keywords optional'}
                            </Switch>
                        </div>
                        <div>
                            <Switch
                                onValueChange={(value) =>
                                    onPromptDupesToggle && onPromptDupesToggle(value)
                                }
                                name='promptDupes'
                                isSelected={promptDupes}
                            >
                                {'Prompt before using dupes to save'}
                            </Switch>
                        </div>
                    </div>
                </Panel>
            </form>
        </div>
    );
};

export default GameConfiguration;
