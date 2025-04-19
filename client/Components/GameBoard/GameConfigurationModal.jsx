import React from 'react';
import GameConfiguration from './GameConfiguration';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

const GameConfigurationModal = ({
    isOpen,
    keywordSettings,
    onClose,
    onKeywordSettingToggle,
    onPromptDupesToggle,
    onPromptedActionWindowToggle,
    onTimerSettingToggle,
    promptDupes,
    promptedActionWindows,
    timerSettings
}) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='lg' scrollBehavior='inside'>
                <ModalContent>
                    <ModalHeader>{'Game Configuration'}</ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GameConfigurationModal;
