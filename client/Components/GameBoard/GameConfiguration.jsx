import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.windows = [
            { name: 'plot', label: 'Plots revealed', style: 'col-sm-4' },
            { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
            { name: 'challengeBegin', label: 'Before challenge', style: 'col-sm-4' },
            { name: 'attackersDeclared', label: 'Attackers declared', style: 'col-sm-4' },
            { name: 'defendersDeclared', label: 'Defenders declared', style: 'col-sm-4' },
            { name: 'dominance', label: 'Dominance phase', style: 'col-sm-4' },
            { name: 'standing', label: 'Standing phase', style: 'col-sm-4' },
            { name: 'taxation', label: 'Taxation phase', style: 'col-sm-4' }
        ];

        this.state = {
            windowTimer: this.props.timerSettings.windowTimer
        };
    }

    onToggle(option, value) {
        if(option === 'promptDupes') {
            if(this.props.onPromptDupesToggle) {
                this.props.onPromptDupesToggle(!value);
            }
        } else if(this.props.onActionWindowToggle) {
            this.props.onActionWindowToggle(option, !value);
        }
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onTimerSettingToggle(option, event) {
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle(option, event.target.checked);
        }
    }

    onKeywordSettingToggle(option, event) {
        if(this.props.onKeywordSettingToggle) {
            this.props.onKeywordSettingToggle(option, event.target.checked);
        }
    }

    render() {
        let windows = this.windows.map(window => {
            return (<Checkbox key={ window.name }
                noGroup
                name={ 'promptedActionWindows.' + window.name }
                label={ window.label }
                fieldClass={ window.style }
                type='checkbox'
                onChange={ this.onToggle.bind(this, window.name, this.props.actionWindows[window.name]) }
                checked={ this.props.actionWindows[window.name] } />);
        });

        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title='Action window defaults'>
                        <div className='form-group'>
                            { windows }
                        </div>
                    </Panel>
                    <Panel title='Timed Interrupt Window'>
                        <div className='form-group'>
                            <Checkbox name='timerSettings.events' noGroup label={ 'Show timer for events' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'events') } checked={ this.props.timerSettings.events } />
                            <Checkbox name='timerSettings.abilities' noGroup label={ 'Show timer for card abilities' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'abilities') } checked={ this.props.timerSettings.abilities } />
                        </div>
                    </Panel>
                    <Panel title='Other Settings'>
                        <div className='form-group'>
                            <Checkbox name='keywordSettings.chooseOrder' noGroup label={ 'Choose order of keywords' } fieldClass='col-sm-6'
                                onChange={ this.onKeywordSettingToggle.bind(this, 'chooseOrder') } checked={ this.props.keywordSettings.chooseOrder } />
                            <Checkbox name='keywordSettings.chooseCards' noGroup label={ 'Make keywords optional' } fieldClass='col-sm-6'
                                onChange={ this.onKeywordSettingToggle.bind(this, 'chooseCards') } checked={ this.props.keywordSettings.chooseCards } />
                            <Checkbox name='promptDupes' noGroup label={ 'Prompt before using dupes to save' } fieldClass='col-sm-6'
                                onChange={ this.onToggle.bind(this, 'promptDupes', this.props.promptDupes) } checked={ this.props.promptDupes } />
                        </div>
                    </Panel>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    actionWindows: PropTypes.object,
    keywordSettings: PropTypes.object,
    onActionWindowToggle: PropTypes.func,
    onKeywordSettingToggle: PropTypes.func,
    onPromptDupesToggle: PropTypes.func,
    onTimerSettingToggle: PropTypes.func,
    promptDupes: PropTypes.bool,
    timerSettings: PropTypes.object
};

export default GameConfiguration;
