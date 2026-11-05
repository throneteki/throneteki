import React from 'react';
import { Radio, RadioGroup, Switch } from '@heroui/react';
import Panel from '../Site/Panel';
import { allowedCardSizes } from '../Profile/CardSizeSettings';

const windows = [
    { name: 'plot', label: 'Plots revealed' },
    { name: 'draw', label: 'Draw phase' },
    { name: 'marshal', label: 'Marshaling phase' },
    { name: 'challengeBegin', label: 'Before challenge' },
    { name: 'attackersDeclared', label: 'Attackers declared' },
    { name: 'defendersDeclared', label: 'Defenders declared' },
    { name: 'dominance', label: 'Dominance phase' },
    { name: 'standing', label: 'Standing phase' },
    { name: 'taxation', label: 'Taxation phase' }
];

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
    const windowsToRender = windows.map((window) => {
        return (
            <div key={window.name}>
                <Switch
                    onValueChange={(checked) =>
                        onActionWindowToggle && onActionWindowToggle(window.name, checked)
                    }
                    name={'promptedActionWindows.' + window.name}
                    isSelected={actionWindows[window.name]}
                    isDisabled={isSpectating}
                >
                    {window.label}
                </Switch>
            </div>
        );
    });

    return (
        <form>
            <div className='flex flex-col gap-2 overflow-y-auto'>
                <Panel title={'Action window defaults'}>
                    <div className='grid sm:grid-cols-2 gap-2'>{windowsToRender}</div>
                </Panel>
                <Panel title={'Responses'}>
                    <div className='flex flex-col gap-2'>
                        <Switch
                            onValueChange={(value) =>
                                onHideResponsesToggle && onHideResponsesToggle('interrupts', value)
                            }
                            name='hideInterrupts'
                            isSelected={hideInterrupts !== false}
                            isDisabled={isSpectating}
                        >
                            {'Hide whether I have interrupts'}
                        </Switch>
                        <Switch
                            onValueChange={(value) =>
                                onHideResponsesToggle && onHideResponsesToggle('reactions', value)
                            }
                            name='hideReactions'
                            isSelected={hideReactions !== false}
                            isDisabled={isSpectating}
                        >
                            {'Hide whether I have reactions'}
                        </Switch>
                    </div>
                </Panel>
                <Panel title='Card Sizing'>
                    <RadioGroup
                        value={cardSizeSetting}
                        onValueChange={(value) =>
                            onCardSizeSettingChange && onCardSizeSettingChange(value)
                        }
                        orientation='horizontal'
                    >
                        {allowedCardSizes.map(({ name, label }) => (
                            <Radio key={name} value={name}>
                                {label}
                            </Radio>
                        ))}
                    </RadioGroup>
                </Panel>
                <Panel title={'Other Settings'}>
                    <div className='flex flex-col gap-2'>
                        <Switch
                            onValueChange={(value) =>
                                onKeywordSettingToggle &&
                                onKeywordSettingToggle('chooseOrder', value)
                            }
                            name='keywordSettings.chooseOrder'
                            isSelected={keywordSettings.chooseOrder}
                            isDisabled={isSpectating}
                        >
                            {'Choose order of keywords'}
                        </Switch>
                        <Switch
                            onValueChange={(value) =>
                                onKeywordSettingToggle &&
                                onKeywordSettingToggle('chooseCards', value)
                            }
                            name='keywordSettings.chooseCards'
                            isSelected={keywordSettings.chooseCards}
                            isDisabled={isSpectating}
                        >
                            {'Ask before resolving challenge keywords'}
                        </Switch>
                        <Switch
                            onValueChange={(value) =>
                                onPromptDupesToggle && onPromptDupesToggle(value)
                            }
                            name='promptDupes'
                            isSelected={promptDupes}
                            isDisabled={isSpectating}
                        >
                            {'Prompt before using dupes to save'}
                        </Switch>
                    </div>
                </Panel>
            </div>
        </form>
    );
};

export default GameConfiguration;
