import React from 'react';
import GameConfiguration from './GameConfiguration';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

const GameConfigurationModal = ({
    isOpen,
    isSpectating,
    keywordSettings,
    onClose,
    onKeywordSettingToggle,
    onPromptDupesToggle,
    onPromptedActionWindowToggle,
    onHideResponsesToggle,
    onHudChange,
    promptDupes,
    promptedActionWindows,
    hideInterrupts,
    hideReactions,
    hud
}) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='lg' scrollBehavior='inside'>
                <ModalContent>
                    <ModalHeader>{'Game Configuration'}</ModalHeader>
                    <ModalBody>
                        <GameConfiguration
                            isSpectating={isSpectating}
                            actionWindows={promptedActionWindows}
                            keywordSettings={keywordSettings}
                            promptDupes={promptDupes}
                            hideInterrupts={hideInterrupts}
                            hideReactions={hideReactions}
                            hud={hud}
                            onKeywordSettingToggle={onKeywordSettingToggle}
                            onHideResponsesToggle={onHideResponsesToggle}
                            onHudChange={onHudChange}
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
