import React, { useCallback } from 'react';
import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';

const windows = [
    { name: 'plot', label: 'Plots revealed', style: 'col-sm-4' },
    { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
    { name: 'challengeBegin', label: 'Before challenge', style: 'col-sm-4' },
    { name: 'attackersDeclared', label: 'Attackers declared', style: 'col-sm-4' },
    { name: 'defendersDeclared', label: 'Defenders declared', style: 'col-sm-4' },
    { name: 'dominance', label: 'Dominance phase', style: 'col-sm-4' },
    { name: 'standing', label: 'Standing phase', style: 'col-sm-4' },
    { name: 'taxation', label: 'Taxation phase', style: 'col-sm-4' }
];

const GameConfiguration = ({
    timerSettings,
    onPromptDupesToggle,
    onActionWindowToggle,
    onTimerSettingToggle,
    onKeywordSettingToggle,
    actionWindows,
    keywordSettings,
    promptDupes
}) => {
    const onToggle = useCallback(
        (option, value) => {
            if (option === 'promptDupes') {
                onPromptDupesToggle && onPromptDupesToggle(!value);
            } else {
                onActionWindowToggle && onActionWindowToggle(option, !value);
            }
        },
        [onPromptDupesToggle, onActionWindowToggle]
    );

    const onTimerSettingToggleLocal = useCallback(
        (option, event) => {
            onTimerSettingToggle && onTimerSettingToggle(option, event.target.checked);
        },
        [onTimerSettingToggle]
    );

    const onKeywordSettingToggleLocal = useCallback(
        (option, event) => {
            onKeywordSettingToggle && onKeywordSettingToggle(option, event.target.checked);
        },
        [onKeywordSettingToggle]
    );

    const windowsRender = windows.map((window) => (
        <Checkbox
            key={window.name}
            noGroup
            name={'promptedActionWindows.' + window.name}
            label={window.label}
            fieldClass={window.style}
            type='checkbox'
            onChange={() => onToggle(window.name, actionWindows[window.name])}
            checked={actionWindows[window.name]}
        />
    ));

    return (
        <div>
            <form className='form form-horizontal'>
                <Panel title='Action window defaults'>
                    <div className='form-group'>{windowsRender}</div>
                </Panel>
                <Panel title='Timed Interrupt Window'>
                    <div className='form-group'>
                        <Checkbox
                            name='timerSettings.events'
                            noGroup
                            label={'Show timer for events'}
                            fieldClass='col-sm-6'
                            onChange={(event) => onTimerSettingToggleLocal('events', event)}
                            checked={timerSettings.events}
                        />
                        <Checkbox
                            name='timerSettings.abilities'
                            noGroup
                            label={'Show timer for card abilities'}
                            fieldClass='col-sm-6'
                            onChange={(event) => onTimerSettingToggleLocal('abilities', event)}
                            checked={timerSettings.abilities}
                        />
                    </div>
                </Panel>
                <Panel title='Other Settings'>
                    <div className='form-group'>
                        <Checkbox
                            name='keywordSettings.chooseOrder'
                            noGroup
                            label={'Choose order of keywords'}
                            fieldClass='col-sm-6'
                            onChange={(event) => onKeywordSettingToggleLocal('chooseOrder', event)}
                            checked={keywordSettings.chooseOrder}
                        />
                        <Checkbox
                            name='keywordSettings.chooseCards'
                            noGroup
                            label={'Make keywords optional'}
                            fieldClass='col-sm-6'
                            onChange={(event) => onKeywordSettingToggleLocal('chooseCards', event)}
                            checked={keywordSettings.chooseCards}
                        />
                        <Checkbox
                            name='promptDupes'
                            noGroup
                            label={'Prompt before using dupes to save'}
                            fieldClass='col-sm-6'
                            onChange={() => onToggle('promptDupes', promptDupes)}
                            checked={promptDupes}
                        />
                    </div>
                </Panel>
            </form>
        </div>
    );
};

export default GameConfiguration;
