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
    onCardSizeSettingChange,
    promptDupes,
    promptedActionWindows,
    hideInterrupts,
    hideReactions,
    cardSizeSetting
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
                            cardSizeSetting={cardSizeSetting}
                            onKeywordSettingToggle={onKeywordSettingToggle}
                            onHideResponsesToggle={onHideResponsesToggle}
                            onCardSizeSettingChange={onCardSizeSettingChange}
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
