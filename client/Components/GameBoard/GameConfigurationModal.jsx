import React from 'react';
import GameConfiguration from './GameConfiguration';
import Dialog from '../Site/Dialog';

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
        <Dialog
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title='Game settings'
            size='lg'
            className='max-w-[56rem]'
        >
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
        </Dialog>
    );
};

export default GameConfigurationModal;
