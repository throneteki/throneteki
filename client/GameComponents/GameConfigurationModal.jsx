import React from 'react';
import PropTypes from 'prop-types';

import GameConfiguration from './GameConfiguration.jsx';
import Modal from '../SiteComponents/Modal.jsx';

export class GameConfigurationModal extends React.Component {
    render() {
        return (
            <Modal id={ this.props.id } className='settings-popup row' bodyClassName='col-xs-12' title='Game Configuration'>
                <GameConfiguration
                    actionWindows={ this.props.promptedActionWindows }
                    keywordSettings={ this.props.keywordSettings }
                    timerSettings={ this.props.timerSettings }
                    onKeywordSettingToggle={ this.props.onKeywordSettingToggle }
                    onTimerSettingToggle={ this.props.onTimerSettingToggle }
                    onToggle={ this.props.onPromptedActionWindowToggle }
                />
            </Modal>);
    }
}

GameConfigurationModal.displayName = 'GameConfigurationModal';
GameConfigurationModal.propTypes = {
    id: PropTypes.string,
    keywordSettings: PropTypes.object,
    onKeywordSettingToggle: PropTypes.func,
    onPromptedActionWindowToggle: PropTypes.func,
    onTimerSettingToggle: PropTypes.func,
    promptedActionWindows: PropTypes.object,
    timerSettings: PropTypes.object

};

export default GameConfigurationModal;
