import React from 'react';
import GameConfiguration from './GameConfiguration';
import Modal from '../Site/Modal';

const GameConfigurationModal = ({
    id,
    promptedActionWindows,
    keywordSettings,
    promptDupes,
    timerSettings,
    onKeywordSettingToggle,
    onTimerSettingToggle,
    onPromptedActionWindowToggle,
    onPromptDupesToggle
}) => {
    return (
        <Modal
            id={id}
            className='settings-popup row'
            bodyClassName='col-xs-12'
            title='Game Configuration'
        >
            <GameConfiguration
                actionWindows={promptedActionWindows}
                keywordSettings={keywordSettings}
                promptDupes={promptDupes}
                timerSettings={timerSettings}
                onKeywordSettingToggle={onKeywordSettingToggle}
                onTimerSettingToggle={onTimerSettingToggle}
                onActionWindowToggle={onPromptedActionWindowToggle}
                onPromptDupesToggle={onPromptDupesToggle}
            />
        </Modal>
    );
};

export default GameConfigurationModal;
